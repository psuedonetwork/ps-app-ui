import * as React from 'react';
import './index.css';
import { widget } from '../../charting_library';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// datafeedUrl: 'http://localhost:3444',
// datafeedUrl: 'https://demo_feed.tradingview.com'
export class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'SafeMoon',
		interval: '1D',
		containerId: 'tv_chart_container',
		datafeedUrl: 'http://localhost:3444',
		libraryPath: './charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		timeFrames: [{
			text: "5y",
			resolution: "1M"
		}, {
			text: "1y",
			resolution: "1M"
		}, {
			text: "6m",
			resolution: "1W"
		}, {
			text: "3m",
			resolution: "1D"
		}, {
			text: "1m",
			resolution: "1D"
		}, 
		{
			text: "1w",
			resolution: "240"
		},{
			text: "5d",
			resolution: "240"
		}, {
			text: "1d",
			resolution: "5"
		}],
	};

	tvWidget = null;

	componentDidMount() {
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: getLanguageFromURL() || 'en',
			//disabled_features: ['use_localstorage_for_settings'],
			//enabled_features: ['study_templates'],
			//charts_storage_url: this.props.chartsStorageUrl,
			//charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			time_frames: this.props.timeFrames,
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

				button.innerHTML = 'Check API';
			});
		});
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}
