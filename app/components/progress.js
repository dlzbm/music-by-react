import React from 'react';
import './progress.less'


let Progress = React.createClass({
	getDefaultProps() {
		return {
			bgColor: '#2f9842',
		}
	},
	changeProgress(e){
		let progressBar = this.refs.progressBar;
		let progress = (e.screenX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth 
		this.props.onProgressChange && this.props.onProgressChange(progress);
	},
	render() {
		return(
			<div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
				<div className="progress" style={{width: `${this.props.progress}%`, background : this.props.bgColor}}></div>
			</div>
			)
	}
});

export default Progress;