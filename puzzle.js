var RN=4,CN=4;
var cells=null;//4x4的数组，保存指定位置的图片
var pg=document.getElementById("playground");//图片容器
var timer=null;//定时器，由于计时
var time=0;//时间显示

function updateTime() {
    var span=document.querySelector("#ref-score span");
    span.innerHTML=String(time);
    time++;
}
//启动游戏
function start() {
    //初始化数组
	time=0;
    timer=setInterval(updateTime,1000);
    init();
	//cells_win=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,-1]];
    updateView();
    showView();
}
//初始化数组，并刷新页面动画
function init() {
    cells=new Array(RN);
    var tempRand=[];
    for(var i=0;i<cells.length;i++){
        cells[i]=[];
        for(var j=0;j<CN;j++) {
            while (true) {
                var randNum = parseInt(Math.random() * 15);
                if(tempRand.indexOf(randNum)==-1){
                    cells[i][j]=randNum;
                    tempRand.push(randNum);
                    break;
                }
                else if(tempRand.length==RN*CN-1){
                    cells[i][j]=-1;
                    break;
                }
            }
        }
    }
}
function updateView(){
    var frag=document.createDocumentFragment();
    for(var i=0;i<RN;i++){
        for(var j=0;j<CN;j++){
            if(cells[i][j]!=-1){
               frag.appendChild(createImage(i,j));
            }
        }
    }
    pg.appendChild(frag);
}
function showView() {
    var show=
    (function() {
        var index=0;
        return function(){
            pg.children[index].style.opacity=1;
            index++;
            if(index==15)
                return false;
            return true;
        }
    })();
    (function showImg() {
        if(show())
            setTimeout(showImg,200);
    })();
}
function createImage(i, j) {
    var img=new Image();
    img.src="images/"+cells[i][j]+".jpg";
    img.style.width="100px";
    img.style.left=j*100+"px";
    img.style.top=i*100+"px";
    img.style.opacity=0;
    return img;
}
//为img元素添加点击事件
pg.onclick=function (e) {	
    if(e.target.nodeName=="IMG"){
        var r=parseInt(e.target.style.top.slice(0,-2)/100);
        var c=parseInt(e.target.style.left.slice(0,-2)/100);
        var offset=null;
        if((offset=canMove(r,c))!=null){
            //移动图片
            move(r,c,e.target,offset);
            cells[r+offset.v][c+offset.h]=cells[r][c];
            cells[r][c]=-1;
        }
    }
	if(isWin()){
            clearInterval(timer);
            document.getElementById("mask").style.display="block";
			//return;
        }
}
function canMove(r, c) {
    //debugger;
    //console.log(r,c);
    if(r>0&&cells[r-1][c]==-1)
        return {h:0,v:-1};
    if(r<3&&cells[r+1][c]==-1)
        return {h:0,v:+1};
    if(c>0&&cells[r][c-1]==-1)
        return {h:-1,v:0};
    if(c<3&&cells[r][c+1]==-1)
        return {h:+1,v:0};
    else
        return null;
}
function move(r, c, img, off) {
    var top=r*100;
    var left=c*100;
    //debugger;
    top+=off.v*100;
    left+=off.h*100;
    img.style.left=left+"px";
    img.style.top=top+"px";
}
function isWin() {
    var value=0;
    for(var r =0;r<RN;r++){
        for(var c=0;c<CN;c++){
            if(cells[r][c]!=value++ && cells[r][c]!=-1)
                return false;
        }
    }
	//if(cells[r-1][c-1]==-1)
	return true;
}

document.querySelector("#mask button").onclick=function (e) {
    this.parentNode.parentNode.style.display="none";
    start();
}
start();