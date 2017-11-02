import React from 'react';
import { Router,IndexRoute,Link,Route,hashHistory } from 'react-router';
import './header.less'
import Pubsub from 'pubsub-js';
import $ from 'jquery';


let Header = React.createClass({
	onSearch(e) {
        e.preventDefault();
	},
	keySearch(e){
		let val = e.target.value;
		if (e.keyCode == 13){
			Pubsub.publish('SET_SEARCH_VAL',val);
			console.log('回车键','被按下了');
			hashHistory.push('/search')
		} 
	},
	render() {
		return(
			<div className="components-header row" title="返回播放页面">
				<img  src="./static/images/logo.png" width = '40' className="-col-auto" />
				<div className='caption'>MusicPlayer</div>
				<input type="text" className="search -col-auto" placeholder="搜索"  onClick={this.onSearch} onKeyDown={this.keySearch}  />
				<img  src="./static/images/psb.gif" width = '60' className="-col-auto" />
			</div>
			)
	}
});

export default Header;