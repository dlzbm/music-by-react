import React from 'react';
import MUSIC_LIST from '../config/config'
import ListItem from '../components/listItem'



let Musiclist = React.createClass({
	render() {
		let Items =this.props.musiclist?this.props.musiclist.map((item) => {
			return (
    			<ListItem
    				key={item.id}
    				data={item}
                    focus={this.props.currentMusicItem === item}
                    id={this.props.currentMusicItem.id}
    			></ListItem>
    		);
		}):''
		return (
			<ul className='mt20'>
				{Items}
			</ul>
		);
	}
});
export default Musiclist;