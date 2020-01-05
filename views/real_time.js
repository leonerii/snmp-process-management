var cpu_data = []
var last_value = 0
var interval = 5000
var cores = 1

console.log(target)

function get_cpu_data(qs){
    axios.get('http://127.0.0.1:3000/api/cpu/' + qs,
        {'headers': 
            {'Content-Type': 'application/json'}
        })
        .then(data => {
            if(last_value){
                var curr_value = data.data.value
                var value = (curr_value - last_value)/(interval * cores)
                cpu_data.push(value.toFixed(2) * 100)
                last_value = curr_value
            }
            else
                last_value = data.data.value
        })
        .catch(err => {
            cpu_data.push(null)
            console.log(err)
        })
}

var queryString = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)

var options = {
    series: [{
        name: "CPU Usage",
        data: cpu_data
    }],
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        },
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: "CPU Usage",
        align: 'left'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    yaxis: {
        max: 100,
        min: 0
    },
    xaxis: {
        tickAmount: 40,
        min:0,
        max: 30,
        range: 30
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

window.setInterval(() => {
    get_cpu_data(queryString)
    chart.updateSeries([{
        data: cpu_data
    }])
},interval)




