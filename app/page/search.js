import React from 'react';
import { Router,IndexRoute,Link,Route,hashHistory } from 'react-router';
import Pubsub from 'pubsub-js';
import $ from 'jquery';
import ListItem from '../components/listItem'

let Search = React.createClass({
	getInitialState() {
		return {
			searchList:null,
			searchVal:null,
		}
	},
	searchAjax(urlString){
        let self = this;
		let list = [];
		//$.getJSON("http://e.hnce.com.cn/tools/ajax.aspx?jsoncallback=?", { id: 0, action: 'jobcategoryjson' }, function(json) { alert(json[0].pid); alert(json[0].items[0]._name); });　 
		$.post("http://xzqyun.com/interface/searchmusicheader.php",{urlString:urlString},function(result){
			var result = eval('(' + result + ')');
            result = result.data.song.list;
			result.forEach(e =>{
				let es = e['f'].split('|');
				list.push({id: es[0], songName: es[1], singerName: es[3], albumId: es[4]});
			})
			console.log(list);
			self.setState({
				searchList:list
			});
		});
	},
	componentWillMount() {
		let self =this;
	    Pubsub.subscribe('SEARCH_GO', (msg, val) =>{
			self.setState({searchVal:val});
			let num = 10;
		    let urlString = `http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=${num}&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=${val}`;
		    self.searchAjax(urlString);
		});

	},
	render() {
		console.log(this.state);
		//let searchVal = this.props.searchVal;
		let Items =this.state.searchList?this.state.searchList.map((item) => {
			return (
    			<ListItem
    				key={item.id}
    				data={item}
    			></ListItem>
    		);
		}):'暂无数据,请查询网络后重新搜索'
		return(
			<ul className='mt20'>
				{Items}
			</ul>
			)
	}
});

export default Search;
