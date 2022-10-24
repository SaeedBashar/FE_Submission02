if(localStorage.getItem('accessToken') == null) window.location.assign('./login.html')

let orders;
let temp_orders;
let page;
let total;

let uri = 'https://freddy.codesubmit.io/orders ';

let headers = new Headers();
headers.append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);

let request = new Request(uri, {
    headers: headers
});

fetch(request)
.then(res=>{
    if(res.ok)
        return res.json()
    throw new Error('Unexpected Error')
})
.then(data=>{
    if(!('msg' in data)){
        orders = temp_orders = data.orders;
        page = data.page;
        total = data.total;

        constructTable();

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
            if(res.ok)
                return res.json()
            throw new Error('Unexpected Error')
        })
        .then(data=>{
            console.log('Token expired')
            console.log(data);
            localStorage.setItem('accessToken', data.access_token);
            window.location.reload();
        })
        .catch(err=>window.location.assign('./login.html'))
    }   
})
.catch(err=>window.location.assign('./login.html'))

function changeTablePage(arg){
    if(arg == 1){
        if(page != 3)
            page++;
        else
            page = 1;
    }

    if(arg == -1){
        if(page != 0)
            page--;
        else
            page = 3;
    }

    constructTable()
}

function constructTable(){
    if(temp_orders.length != 0){
        let num_per_page = parseInt(temp_orders.length / 3);
        let temp = [];

        if(page == 1)
            temp = temp_orders.slice(0, num_per_page);

        if(page == 2)
            temp = temp_orders.slice(num_per_page, 2 * num_per_page);

        if(page == 3)
            temp = temp_orders.slice(num_per_page * 2);

        document.getElementById('currentPage').innerHTML = page;

        let row = null;
        let bs_table = document.getElementById('orders');
        bs_table.innerHTML = `<tr>
        <th>Product Name</th>
        <th>Date</th>
        <th>Price</th>
        <th>Status</th>
      </tr>`
        for(let order of temp){
            formatted_date = new Date(order.created_at).toDateString();

            row = `<tr prod_id='${order.product.id}' order_id='${order.id}' customer_id='${order.customer.id}'>
                    <td>${order.product.name}</td>
                    <td>${formatted_date}</td>
                    <td>${order.currency + order.total}</td>
                    <td>${order.status}</td>
                </tr>
            `;
            bs_table.innerHTML += row;
        }
    }
    

}

function searchOrder(arg){
    
    if(arg != ""){
        
        temp_orders = orders.filter(x => x.product.name.toLowerCase().indexOf(arg.toLowerCase()) != -1);
        
        page = 1;
        constructTable()

    }else{
        temp_orders = orders;
        page = 1;
        constructTable();
    }
}

function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    window.location.assign('./login.html');
}