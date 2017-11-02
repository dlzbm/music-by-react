import React from 'react';
import Progress from '../components/progress'
import './player.less'
import { Link } from 'react-router'
import Pubsub from 'pubsub-js';


let duration = null;
let Player = React.createClass({
	getInitialState() {
		return {
			progress: 0,	//进度
			volume:0,   	//声音
			isPlay:true,	//播放暂停
			leftTime:'',	//剩余时间
		}
	},
	componentDidMount() {
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {
			duration = e.jPlayer.status.duration;
			this.setState({
				progress:e.jPlayer.status.currentPercentAbsolute,
				volume:e.jPlayer.options.volume *100,
				leftTime:this.formatTiem(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			});
		});
		Pubsub.subscribe('ISPLAY_TRUE', () =>{
			this.setState({
				isPlay:true
			})
		});
	},
	//播放进度
	progressChangeHandLer(progress){
		$('#player').jPlayer('play',duration * progress);
		this.setState({isPlay:true})
	},
	//音量调节
	progressVolumeHanLer(progress){
		$('#player').jPlayer('volume',progress);
	},
	//函数销毁
	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	},
	//上下曲
	playNext(str) {
		Pubsub.publish('PLAY_NEXT',str);
	},
	//开始暂停
	playSwitch() {
		if(this.state.isPlay){
			$('#player').jPlayer('pause');
		}else{
			$('#player').jPlayer('play');
		}
		this.setState({
			isPlay: !this.state.isPlay
		})
	},
	//格式化时间 eg 23:02
	formatTiem(time){
		let m = Math.floor(time / 60);
		let s = Math.floor(time % 60);
		s = s < 10 ? `0${s}` : s;
		return `${m}:${s}`;
	},
	//循环类型  noce cycle random
	repeatPlay(){
		Pubsub.publish('REPEAT_PLAY');
	},
	render() {
		var image_id  = this.props.currentMusicItem?this.props.currentMusicItem.albumId:139643;
		let pic = `http://imgcache.qq.com/music/photo/album_300/${image_id%100}/300_albumpic_${image_id}_0.jpg`;
		return(
			<div className="player-page">
				<h1 className="caption"><Link to="/list">播放列表 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem?this.props.currentMusicItem.songName:'网络出错,请检查你的网络后刷新'}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItem?this.props.currentMusicItem.singerName:'网络出错,请检查你的网络后刷新'}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					     			<Progress bgColor="#F01616" progress={this.state.volume}  onProgressChange={this.progressVolumeHanLer}/>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px'}}>
			                <Progress progress={this.state.progress} onProgressChange={this.progressChangeHandLer} />
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playNext.bind(this,'prev')}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.playSwitch}></i>
	                						 
	                			<i className="icon next ml20" onClick={this.playNext.bind(this,'next')}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.props.repeatType}`}  onClick={this.repeatPlay}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<div className="coverBox coverBg">
                			<span className={`pointer ${this.state.isPlay ? '' : 'transform-rotate10'}`}></span>
                			<img draggable="false" className={`rotate ${this.state.isPlay ? '' : 'isRotate'}`} src={pic} alt={this.props.currentMusicItem?this.props.currentMusicItem.songName:'网络出错,请检查你的网络后刷新'}/>
                		</div>
                	</div>
                </div>
			</div>
			)
	}
});

export default Player;