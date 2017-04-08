import { Stock } from './stock.js';

export class StockList extends React.Component {
	constructor() {
		super();
		this.state = {tinkers: []};
		this.updateTinkerList = this.updateTinkerList.bind(this);
	}

	componentDidMount() {
		document.querySelector('.stock-container').addEventListener('updateTinkerList', this.updateTinkerList, false);
	}

	updateTinkerList(event) {
		event.stopPropagation();
		this.state.tinkers.push(event.detail);
		this.forceUpdate();
	}

	render() {
		const stocks = this.state.tinkers.map( ([name, price], index) => {
			return( 
				<Stock name={name} price={price} /> 
			)
		});
		return(
			<table className="stock-table">
				<thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>Last Update</th>
                        <th>Graphical</th>
                    </tr>
                </thead>
                <tbody>
					{stocks}
				</tbody>
			</table>
		)
	}
} 