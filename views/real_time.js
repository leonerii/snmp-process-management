var cpu_data = []
var mem_data = []
var systime = []
var cpu_last_value = 0
var interval = 5000
var cores = 1
var memory = 1

function get_process_data(qs){
    axios.get('http://127.0.0.1:3000/api/cpu/' + qs,
        {'headers': 
            {'Content-Type': 'application/json'}
        })
        .then(data => {
            if(cpu_last_value){
                var cpu_curr_value = data.data[0].value
                var cpu_value = (cpu_curr_value - cpu_last_value)/(interval * cores)
                cpu_data.push((cpu_value * 100).toFixed(2))
                cpu_last_value = cpu_curr_value
            }
            else{
                cpu_last_value = data.data[0].value
                cpu_data.push(0)
            }
        
            var mem_curr_value = data.data[1].value * 0.00000095367432
            var mem_value = mem_curr_value / memory
            mem_data.push((mem_value * 100).toFixed(2))

            systime.push(data.data[2].value.toString())
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
    },{
        name: "Memory Usage",
        data: mem_data
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
        min: 0,
        title: {
            text: "Percentage"
        }
    },
    xaxis: {
        categories: systime,
        //tickAmount: 40,
        //min:0,
        //max: 30,
        range: 30
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

window.setInterval(() => {
    get_process_data(queryString)
    chart.updateSeries([{
        data: cpu_data
        //.slice(Math.max(cpu_data.length - 30, 1))
    },{
        data: mem_data
        //.slice(Math.max(mem_data.length - 30, 1))
    }])

    options.xaxis.categories = systime
    chart.updateOptions(options)

},interval)




