/**
* Theme: Adminto Dashboard
* Author: Coderthemes
* Chartist chart
*/

function update() {
  $('#clock').html(moment().locale("ID").format('D MMMM YYYY, H:mm:ss'));
}
setInterval(update, 1000);

//REALTIME
var dataChart = {
  labels: [],
  series: [[]]
};
const clientIdMqtt = "clientPahoAdmin" + moment().unix();
var client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33172, "", clientIdMqtt);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

//Konfigurasi koneksi
client.connect({
  useSSL: true,
  userName: "kqttmvvk",
  password: "Y0rQZssbgQzL",
  cleanSession: true,
  onSuccess: onConnect,
  onFailure: function () {
    done(false);
  }
});
var chartistCfg = {
  low: 0,
  high: 5,
  ticks: [1, 2, 3, 4, 5],
  axisY: {
    onlyInteger: true,          
  },
  plugins: [
    Chartist.plugins.tooltip(),
    Chartist.plugins.ctPointLabels({
      textAnchor: 'middle',
      labelInterpolationFnc: function(value) {return value.toFixed(2)}
    })
  ],
}
var responsiveOptions = [
  ['screen and (max-width: 640px)', {
    showLine: false,
    axisX: {
      labelInterpolationFnc: function(value) {
        return value.substr(6);;
      }
    }
  }]
];
var chart = new Chartist.Line('#smil-animations', dataChart, chartistCfg, responsiveOptions);

function onConnect() {
  console.log("Konek dengan MQTT Broker Berhasil");
  client.subscribe("node/01/sensor/ph");//subscribe dengan TOPIC
  message = new Paho.MQTT.Message("Hello From WEB Admin - Monitor"); //Message
  message.destinationName = "node/pesan"; //Topic
  client.send(message); //kirim sapa ke broker
}

// Ketika koneksi terputus
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// Ketika menerima pesan dari topic yang sudah di subscribe (line:460)
function onMessageArrived(message) {
  var res = JSON.parse(message.payloadString);
  if (dataChart.series[0].length >= 12) {
    dataChart.series[0].shift();
  }
  if (dataChart.labels.length >= 12) {
    dataChart.labels.shift();
  }
  dataChart.labels.push(moment().format('HH:mm:ss'));
  dataChart.series[0].push(res.nilai_ph);
  chart = new Chartist.Line('#smil-animations', dataChart, chartistCfg, responsiveOptions);

}

// Let's put a sequence number aside so we can use it in the event callbacks
var seq = 0,
  delays = 80,
  durations = 500;

// Once the chart is fully created we reset the sequence
chart.on('created', function () {
  chart.off("draw");
});

// On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
chart.on('draw', function (data) {
  seq++;

  if (data.type === 'line') {
    // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
    data.element.animate({
      opacity: {
        // The delay when we like to start the animation
        begin: seq * delays + 1000,
        // Duration of the animation
        dur: durations,
        // The value where the animation should start
        from: 0,
        // The value where it should end
        to: 1
      }
    });
  } else if (data.type === 'label' && data.axis === 'x') {
    data.element.animate({
      y: {
        begin: seq * delays,
        dur: durations,
        from: data.y + 100,
        to: data.y,
        // We can specify an easing function from Chartist.Svg.Easing
        easing: 'easeOutQuart'
      }
    });
  } else if (data.type === 'label' && data.axis === 'y') {
    data.element.animate({
      x: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 100,
        to: data.x,
        easing: 'easeOutQuart'
      }
    });
  } else if (data.type === 'point') {
    data.element.animate({
      x1: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 10,
        to: data.x,
        easing: 'easeOutQuart'
      },
      x2: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 10,
        to: data.x,
        easing: 'easeOutQuart'
      },
      opacity: {
        begin: seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart'
      }
    });
  } else if (data.type === 'grid') {
    // Using data.axis we get x or y which we can use to construct our animation definition objects
    var pos1Animation = {
      begin: seq * delays,
      dur: durations,
      from: data[data.axis.units.pos + '1'] - 30,
      to: data[data.axis.units.pos + '1'],
      easing: 'easeOutQuart'
    };

    var pos2Animation = {
      begin: seq * delays,
      dur: durations,
      from: data[data.axis.units.pos + '2'] - 100,
      to: data[data.axis.units.pos + '2'],
      easing: 'easeOutQuart'
    };

    var animations = {};
    animations[data.axis.units.pos + '1'] = pos1Animation;
    animations[data.axis.units.pos + '2'] = pos2Animation;
    animations['opacity'] = {
      begin: seq * delays,
      dur: durations,
      from: 0,
      to: 1,
      easing: 'easeOutQuart'
    };

    data.element.animate(animations);
  }
});