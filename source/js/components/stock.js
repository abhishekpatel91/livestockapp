export class Stock extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			price: '',
			status: '',
			updatedOn: '',
			timeStamp: '',
			priceLog: []
		};
		this.updateTinker = this.updateTinker.bind(this);
		this.updateTime = this.updateTime.bind(this);
		this.initSparkline = this.initSparkline.bind(this);
	}

	componentWillMount() {
		this.setState({
			name: this.props.name,
			price: this.props.price,
			updatedOn: 'a few seconds ago',
			timeStamp: new Date(),
			priceLog: [(this.props.price).toFixed(2)]
		});
	}

	componentDidMount() {
		document.querySelector('.stock-container').addEventListener('updateTinker', this.updateTinker, false);
	}

	updateTinker(event) {
		event.stopPropagation();
		let status,
			stockPrice = event.detail[this.state.name],
			priceLog = this.state.priceLog;
		if (stockPrice !== this.state.price) {
			status = (stockPrice > this.state.price) ? 'rise' : 'fall';
			(priceLog.length > 5) ? (priceLog.shift()) : null;
			priceLog.push(stockPrice.toFixed(2));
			this.setState({
				price: stockPrice,
				status: status,
				'updatedOn': 'a few seconds ago',
				'timeStamp': new Date(),
				priceLog: priceLog
			});
			this.initSparkline();
		} else {
			this.updateTime();
		}
	}

	updateTime() {
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			now = new Date(),
			timeStamp = this.state.timeStamp,
			updatedOn;

		if (now.toDateString() === timeStamp.toDateString()) {
			let timeDif = (now.getTime() - timeStamp.getTime())/1000;
			timeDif = Math.round(timeDif);
			updatedOn = (timeDif < 5) ? 'a few seconds ago' : (timeDif < 20) ? timeDif + ' seconds ago' : timeStamp.toLocaleTimeString();
		} else {
			updatedOn = timeStamp.getDate() + ' ' + months[timeStamp.getMonth()] + ' ' + timeStamp.toLocaleTimeString();
		}

		this.setState({updatedOn: updatedOn});
	}

	initSparkline() {
		$(this.refs.sparkline).sparkline(this.state.priceLog, {
			width: '85px',
		    height: '30px',
		    lineWidth: 1,
		    spotRadius: 2,
		    spotColor: '#fff',
		    minSpotColor: '#fff',
		    maxSpotColor: '#fff',
		    fillColor: '#333',
		    lineColor: '#fff'
		});
	}

	render() {
		return(
			<tr>
				<td className='text-uppercase'>{this.state.name}</td>
				<td className={this.state.status}>{this.state.price.toFixed(2)}</td>
				<td>{this.state.updatedOn}</td>
				<td><div ref='sparkline'></div></td>
			</tr>
		)
	}
} 