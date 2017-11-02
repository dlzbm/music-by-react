import React from 'react';
import Header from './components/header'
import Search from './page/search'
import Progress from './components/progress'
import Player from './page/player.js'
import Musiclist from './page/musiclist'
import { Router,IndexRoute,Link,Route,hashHistory } from 'react-router';
import Pubsub from 'pubsub-js';


let App = React.createClass({
	getInitialState() {
		return {
			musiclist:'',
			currentMusicItem:{
							    "id": "1913719",
							    "type": 3,
							    "url": "http://stream3.qqmusic.qq.com:0/1913719.wma",
							    "songName": "想你的夜",
							    "singerId": "12770",
							    "singerName": "关喆",
							    "albumId": "139643",
							    "albumName": "身边的故事",
							    "albumLink": "/musicbox/shop/v3/album/43/album_139643.htm",
							    "playtime": "268"
							},
			repeatType:'cycle', //循环类型,默认 顺序播放,
			searchVal:null,
		}
	},
	playMusic(item){
		$('#player').jPlayer('setMedia',{
			mp3:'http://ws.stream.qqmusic.qq.com/'+item.id+'.m4a?fromtag=46'
		}).jPlayer('play');
		this.setState({
			currentMusicItem:item
		});
	},
	playNext: function (type='next') {
		let index = this.findMusicIndex(this.state.currentMusicItem);
		let newIndex = null;
		let musiclistLength = this.state.musiclist.length;
		if(type='next'){
			newIndex = (index + 1) % musiclistLength;
		}else{
			newIndex = (index - 1 +  musiclistLength) % musiclistLength;
		}
		this.playMusic(this.state.musiclist[newIndex]);
	},
	//获取位置
	findMusicIndex:function (item) {
		return this.state.musiclist.indexOf(item);
	},
	//当播放完成时
	playWhenEnd(){
		let repeatType = this.state.repeatType;
		if(repeatType === 'random'){
			let musiclistLength = this.state.musiclist.length;
			let index = Math.ceil(Math.random() * (musiclistLength - 1));
			this.playMusic(this.state.musiclist[index]);
		}else if (repeatType === 'once') {
			this.playMusic(this.state.currentMusicItem);
		}else {
			this.playNext();
		}
	},
	componentDidMount() {
        let self=this;
		$('#player').jPlayer({
			ended: function() { 
				self.playWhenEnd();
			},
			supplied:'mp3',
			wmode:'window'
		});
		$.ajax({
		  type: "post",
		  async: false,
		  url: "http://music.qq.com/musicbox/shop/v3/data/hit/hit_newsong.js",
		  dataType: "jsonp",
		  jsonp: "callback",
		  jsonpCallback: "JsonCallback",
		  scriptCharset: 'GBK',
		  success: function(data) {
		  	self.setState({
		  		musiclist:data.songlist,
		  		currentMusicItem:data.songlist[0],
		  	});
		  	Pubsub.publish('ISPLAY_TRUE');
			self.playMusic(data.songlist[0]);
		  },
		  error: function() {
		    alert('请求数据错误，请刷新重试');
		    window.location.reload();
		  }
		});
		Pubsub.subscribe('PLAY_MUSCI', (msg, item) =>{
			this.playMusic(item);
		});
		Pubsub.subscribe('DELETE_MUSCI', (msg, item) =>{
			this.setState({
				musiclist:this.state.musiclist.filter(items => {
					return items != item;
				})
			})
		});
		Pubsub.subscribe('PLAY_NEXT', (msg, str) =>{
			this.playNext(str);
		});
		Pubsub.subscribe('SET_SEARCH_VAL', (msg, val) =>{
			console.log('rootVal',val);
			this.setState({
				searchVal:val
			})
			Pubsub.publish('SEARCH_GO',val);
		});
		let repeatList= ['once','cycle','random'];
		Pubsub.subscribe('REPEAT_PLAY', () =>{
			let index = repeatList.indexOf(this.state.repeatType);
			let newIndex =  (index + 1) % repeatList.length;
			console.log(newIndex);
			this.setState({
				repeatType:repeatList[(index + 1) % repeatList.length]
			});
		});
	},
	componentWillUnmount() {
		Pubsub.unsubscribe('PLAY_MUSCI');
		Pubsub.unsubscribe('DELETE_MUSCI');
		Pubsub.unsubscribe('PLAY_NEXT');
		Pubsub.unsubscribe('REPEAT_PLAY');
	},
	render() {
		return (
			<div>
				<Link to='/'><Header /></Link>
				{React.cloneElement(this.props.children,this.state)}
			</div>
		);
	}	
});


let Root = React.createClass({
	render(){
		return(
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Player}></IndexRoute>
					<Route path='/list' component={Musiclist}></Route>
					<Route path='/search' component={Search}></Route>
				</Route>
			</Router>
		)
	}
});

export default Root;