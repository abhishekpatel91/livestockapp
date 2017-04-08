import { StockList } from './components/stockList.js';

const initSocket = () => {
    const stockHistory = {},
        socket = new WebSocket('wss://stocks.mnet.website');

    socket.onopen = () => {
        ReactDOM.render( < StockList / > , document.querySelector('.react-container'));
    }

    socket.onerror = (event) => {
        console.info('Error!!!!');
    }

    socket.onclose = (event) => {
        console.info('Connection closed.');
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        $('.refresh').toggleClass('active');      
        data.map(([name, price], index) => {
            if (stockHistory[name]) {
                stockHistory[name] = price;
                document.querySelector('.stock-container').dispatchEvent(new CustomEvent('updateTinker', { detail: stockHistory }));
            } else {
                stockHistory[name] = price;
                document.querySelector('.stock-container').dispatchEvent(new CustomEvent('updateTinkerList', { detail: [name, price] }));
            }
        });
    }
}

if (WebSocket) {
    initSocket();
} else {
    alert('Your browser does not support web sockets. Please use another browser!');
}
