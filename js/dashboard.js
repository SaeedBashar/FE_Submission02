let bestSellers;
let weekSales; 
let yearSales;

const year_x_label = ["This Month", "Last Month", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7",
        "Month 8", "Month 9", "Month 10", "Month 11", "Month 12"];

const week_x_label = ["Today", "Yesterday", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]

let uri = 'https://freddy.codesubmit.io/dashboard';

let headers = new Headers();
headers.append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);

let request = new Request(uri, {
    headers: headers
});

fetch(request)
.then(res=>res.json())
.then(data=>{
    if(!('msg' in data)){
        const dashboard = data.dashboard;
        bestSellers = dashboard.bestsellers;
        weekSales = dashboard.sales_over_time_week;
        yearSales = dashboard.sales_over_time_year;
        
        constructChart(weekSales, week_x_label);

        let row = null;
        let bs_table = document.getElementById('bestsellers');

        for(let prod of bestSellers){
            row = `<tr id='${prod.product.id}'>
                    <td>${prod.product.name}</td>
                    <td>$100</td>
                    <td>${prod.units}</td>
                    <td>${prod.revenue}</td>
                </tr>
            `;
            bs_table.innerHTML += row;
        }

        
        console.log(data)
    }else{
        
        let uri = 'https://freddy.codesubmit.io/refresh'
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${localStorage.getItem('refreshToken')}`);

        let request = new Request(uri, {
            method: 'POST',
            headers: headers
        });

        fetch(request)
        .then(res=>{
            console.log(res)
            return res.json()
        })
        .then(data=>{
            console.log('Token expired')
            console.log(data);
            localStorage.setItem('accessToken', data.access_token);
            window.location.reload();
        })
    }
    
})

function constructChart(arg, xaxis_label){

    let orders = [];
    let totals = [];
    for(let i in arg){
        orders.push(arg[i]['orders'])
        totals.push(arg[i]['total'])
    }

    
        (() => {
        new ApexCharts(document.querySelector("#reportsChart"), {
            series: [{
            name: 'Orders',
            data: orders,
            }, {
            name: 'Total',
            data: totals
            }],
            chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
            },
            markers: {
            size: 4
            },
            colors: ['#4154f1', '#2eca6a'],
            fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
            },
            dataLabels: {
            enabled: false
            },
            stroke: {
            curve: 'smooth',
            width: 2
            },
            xaxis: {
            type: 'days',
            categories: xaxis_label
            },
            tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
            }
        }).render();
        })();
}

function renderChart(el){
    
    document.querySelector("#reportsChart").innerHTML = null;
    if(el.checked){
        document.getElementById('chartTitle').innerText = 'Revenue (last 12 months)'
        constructChart(yearSales, year_x_label)
    }
    else{
        document.getElementById('chartTitle').innerText = 'Revenue (last 7 days)'
        constructChart(weekSales, week_x_label);
    }
}