import React from 'react';
import Pubsub from 'pubsub-js';
require('./listitem.less');

let ListItem = React.createClass({
    playMusic(item){
        Pubsub.publish('PLAY_MUSCI',item);
    },
    deleteMusic(item,e){
        e.stopPropagation();
        Pubsub.publish('DELETE_MUSCI',item);
    },
    render() {
    	let item = this.props.data;
        console.log('此刻播放的id',this.props.id?this.props.id:'kong');
        var image_id  = item?item.albumId:139643;
        let pic = `http://imgcache.qq.com/music/photo/album_300/${image_id%100}/300_albumpic_${image_id}_0.jpg`;
        return (
            <li className={`row components-listitem ${this.props.focus? 'focus' : ''}`}>
                <p className="-col-auto hedaer"><img src={pic}  /></p>
                <p><span className="bold">{item?item.songName:'暂无数据'}</span>--{item?item.singerName:'暂无数据'} <span  onClick={this.playMusic.bind(this,item)} className="play icon"></span></p>
                <p className="-col-auto delete"  onClick={this.deleteMusic.bind(this,item)}></p>
            </li>
        );
    }
});

export default ListItem;
