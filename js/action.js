/*created by yuanzeping*/
window.onload=function(){
    slidesearch();
    updatetable();
    togglemaintab();//切换一级tab
    togglesecondtab();//切换二级tab
    togglesearch();//显示隐藏搜索结果
    calldate();//调用日历
    detectmonth();//检测闰年与大小月
    editdate();//编辑日期
    detectstate();//检测数据状态
    hidesecondtab();
    search();
}
var map={
    "STATUS": "状态",
    "WORKSHEETCODE": "工单编号",
    "NODENAME": "节点",
    "ACCESSLINKCODE": " 接入电路代号",
    "ISYUYUE": "是否预约",
    "PREVIEWRESULT":"预览结果",
    "CUTOVERBEGINTIME": "割接开始时间",
    "CREATEUSER": "创建者",
    "SERVNAME": "业务名称",
    "CUTOVERENDTIME": "割接截止时间",
    "LINKSTATUS": "结单状态",
    "CREATETIME": "创建时间",
    "OPERTYPE": "操作类型",
    "SERVORDERCODE": "订单流水号",
    "WSID": "调单信息",
    "COMPTIME": "完成时间",
    "CUSTNAME":"客户名称",
    "AACCESSLINKCODE":"甲端接入电路代号",
    "BACCESSLINKCODE":"乙端接入电路代号"
}
//hash映射
function hash(value){
    return map[value];
}
//ajax请求
function ajax(url,callback){
        var xhr=new XMLHttpRequest()||new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("GET",url,true);
        xhr.send();
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4&&xhr.status===200){
                var data=JSON.parse(xhr.responseText);
                     callback(data)();
            }
        }

}

//切换搜索
function slidesearch(){
    var span=document.querySelectorAll(".search span");
    for(var i=0;i<span.length;i++){
        span[i].addEventListener("click",function(){
            var firstsearch=document.querySelectorAll(".firstsearch")[0];
            firstsearch.setAttribute("class","");
            this.setAttribute("class","firstsearch");
        })
    }
    
}
//清空表格
function emptytable(dom){
    var rowNum=dom.rows.length;
    for (k=0;k<rowNum;k++)
     {
         dom.deleteRow(k);
         rowNum=rowNum-1;
         k=k-1;
     }
}
//加载数据
function updatetable(){
    var tbody=document.querySelectorAll(".tablewrap table tbody")[0];
    var thead=document.querySelectorAll(".tablewrap table thead")[0];
    var itembody=document.querySelectorAll(".items tbody")[0];
    emptytable(tbody);
    emptytable(thead);
    emptytable(itembody);
    var activetab=document.querySelectorAll("#secondtab li:not(.inactive)")[0].innerHTML;
    ajax("WrJson_GetVpnWsInfo_NOD999_zyucwh_三层VPN业务_自动开通_1.json",function(data){
        var theadtr=document.createElement("tr");
        var theadtd=document.createElement("td");
        var filterbutton=new Image();
        filterbutton.src="img/filter.png";
        theadtd.appendChild(filterbutton);
        theadtr.appendChild(theadtd);
        var searchtr=document.createElement("tr");
        var searchtd=document.createElement("td");
        searchtr.appendChild(searchtd);
        var itemNum=0;
        for(var a=0;a<5;a++){
            var itemtr=document.createElement("tr");
            for(var b=0;b<4;b++){
                var itemtd=document.createElement("td");
                itemtr.appendChild(itemtd);
            }
            itembody.appendChild(itemtr);
        }
        var itemlist=document.querySelectorAll(".items tbody td");
        for(name in data.level1[0]){
            var theadtd=document.createElement("td");
            theadtd.innerHTML=hash(name);
            theadtr.appendChild(theadtd);
            var searchtd=document.createElement("td");
            var searchinput=document.createElement("input");
            searchtd.appendChild(searchinput);
            searchtr.appendChild(searchtd);
            var checkedbox=document.createElement("input");
            checkedbox.type="checkbox";
            var textnode=document.createTextNode(hash(name));
            itemlist[itemNum].appendChild(checkedbox);
            itemlist[itemNum].appendChild(textnode);
            itemNum++;
        }
            for(var j=0;j<data.level1.length;j++){
                    var tr=document.createElement("tr");
                    var td=document.createElement("td");
                    var i=0;
                    switch(activetab){
                                     case "自动开通":
                                           var button=document.createElement("button");
                                         button.innerHTML="操作";
                                          td.appendChild(button);
                                         break;
                                    case "手动开通":
                                           var button=document.createElement("button");
                                         button.innerHTML="操作";
                                          td.appendChild(button);
                                         break;
                                    case "待割接电路":
                                         var img=new Image();
                                         img.src="img/delete.png";
                                         var button=document.createElement("button");
                                         button.innerHTML="部署";
                                          td.appendChild(button);
                                         td.appendChild(img);
                                         break;
                                    case "查询预约":
                                           var button=document.createElement("button");
                                         button.innerHTML="预约";
                                          td.appendChild(button);
                                         break;
                                     default:
                                         break;
                                 }
                tr.appendChild(td);
                     for(col in data.level1[j]){
                    var td=document.createElement("td");
                             td.innerHTML=data.level1[j][col];
                         tr.appendChild(td);
                         i++;
                  }
                    thead.appendChild(theadtr);
                    thead.appendChild(searchtr);
                    tbody.appendChild(tr)
   }
        toggleitems();//复选框
         togglesetting();//调用操作菜单
        detectselect();//检测复选项
        selectall();//全选
        changeselect();//改变选择项
    })
}
//显示隐藏搜索结果
function togglesearch(){
    var mainsearch=document.getElementById("mainSearch");
    var searchfilter=document.getElementById("searchfilter");
    var searchresult=document.querySelectorAll(".searchresult")[0];
    mainsearch.addEventListener("focus",function(){
            searchresult.setAttribute("class","searchresult");
    });
     searchfilter.addEventListener("click",function(){
            searchresult.setAttribute("class","searchresult hide");
    });
    mainsearch.addEventListener("blur",function(){
        if(!mainsearch.value){
            searchresult.setAttribute("class","searchresult hide");
        }
        
    })
}
//调用搜索
function search(){
    var searchbutton=document.querySelectorAll(".search button")[0];
    searchbutton.addEventListener("click",function(){
        getsearchresult();
    })
}
//加载搜索结果
function getsearchresult(){
    var searchtable=document.querySelectorAll(".searchresult table")[0];
    emptytable(searchtable);
    ajax("WrJson_GetVpnSearch_NOD999_zyucwh_JT201643210007-1.json",function(data){
    for(var i=0;i<data.level1.length;i++){
        var tr=document.createElement("tr");
         for(col in data.level1[i]){
            if(hash(col)){
                var td=document.createElement("td");
            td.innerHTML=data.level1[i][col];
             tr.appendChild(td);
            }else{
                continue;
            }
            
        }
        searchtable.appendChild(tr);
    }
    })
}
//切换一级tab
function togglemaintab(){
    var tablist=document.querySelectorAll("#maintab li");
    var secondtab=document.getElementById("secondtab");
    var length=tablist.length;
    var firstselect=document.querySelectorAll("#secondtab li")[0];
    for(var i=0;i<length;i++){
        tablist[i].addEventListener("click",function(){
            document.querySelectorAll(".active")[0].setAttribute("class","");
            this.setAttribute("class","active");
            secondtab.style.left=this.getBoundingClientRect().left+this.scrollLeft+'px';
            firstselect.click();
        })
    }
}

//切换二级tab
function  togglesecondtab(){
    var tablist=document.querySelectorAll("#secondtab li");
    var length=tablist.length;
    var tabname=document.getElementById("tabname");
     var tbody=document.querySelectorAll(".dataBox table tbody")[0];
     var firstcolum=document.querySelectorAll(".dataBox table tr td:nth-child(2)");
    var secondcolum=document.querySelectorAll(".dataBox table tr td:nth-child(3)");
    for(var i=0;i<length;i++){
        tablist[i].addEventListener("click",function(){
            var inactive=this.parentNode.childNodes;
            for(var i=0;i<inactive.length;i++){
                inactive[i].setAttribute("class","inactive");
            }
            this.setAttribute("class","");
            tabname.innerHTML=this.getAttribute("rel");
            if(this.innerHTML=="查询预约"){
                    for(var i=0;i<firstcolum.length;i++){
                        firstcolum[i].setAttribute("class","");
                    }
                    for(var j=0;j<secondcolum.length;j++){
                        secondcolum[j].setAttribute("class","");
                    }
            }else{
                for(var i=0;i<firstcolum.length;i++){
                        firstcolum[i].setAttribute("class","hide");
                    }
                    for(var j=0;j<secondcolum.length;j++){
                        secondcolum[j].setAttribute("class","hide");
                    }
            }
            updatetable();
            editdate();//编辑日期
            togglesetting();
                    var settingmenu=document.getElementById("setting");
                    settingmenu.style.top=-1000+'px';
                    tbody.style.overflow="auto";
                    var datepicker=document.getElementById("datepicker");
                    var dateselector=document.querySelectorAll(".dateselector")[0];
                     datepicker.style.top=-1000+'px';
                    tbody.style.overflow="auto";
                    dateselector.style.display="none";
        })
    }
}
//显示隐藏复选框
function toggleitems(){
    var filterbutton=document.querySelectorAll("img[src='img/filter.png']")[0];
    var item=document.querySelectorAll(".items")[0];
    filterbutton.addEventListener("click",function(){
        if(item.offsetLeft==-1000){
            item.style.left=this.getBoundingClientRect().left+this.scrollLeft+20+'px';
        }else{
            item.style.left=-1000+'px';
        }
       
    })
}

//检测复选框
function detectselect(){
    var selectlist=document.querySelectorAll(".items input");
    var length=selectlist.length;
    for(var i=1;i<length;i++){
        var column=document.querySelectorAll('.tablewrap table tr td:nth-child('+(i+1)+')');
       if(selectlist[i].checked){
           for(var j=0;j<column.length;j++){
               column[j].setAttribute("class","");
           }
       }else{
           for(var j=0;j<column.length;j++){
               column[j].setAttribute("class","hide");
           }
       }
    }
}
//全选复选框
function selectall(){
     var fullselect=document.querySelectorAll(".items input")[0];
     var selectlist=document.querySelectorAll(".items input");
         if(fullselect.checked){
             for(var i=1;i<selectlist.length;i++){
                 selectlist[i].checked=true;
                 detectselect();
             }
         }else{
             for(var i=1;i<selectlist.length;i++){
                 selectlist[i].checked=false;
                 detectselect();
             }
         }
}
//变换复选框
function changeselect(){
    var selectlist=document.querySelectorAll(".items input");
    for(var i=0;i<selectlist.length;i++){
        selectlist[i].addEventListener("click",(function(k){
         return function(){
              if(k){
                detectselect();
            }else{
                selectall();
            }
         }
           
        })(i));
    }
}
//清空ul
function emptyul(dom){
    while(dom.childNodes.length){
        dom.removeChild(dom.childNodes[0]);
    }
}
//生成菜单
function generatemenu(){
    var menu=document.getElementById("setting");
    emptyul(menu);
    ajax("WrJson_GetVpnOperList_NOD999_user=zyucwh_vpntype=三层VPN业务_opertype=退租_status=待预览.json",function(data){
        console.log(data);
        for(var i=0;i<data.level1.length;i++){
            var li=document.createElement("li");
            var a=document.createElement("a");
            a.innerHTML=data.level1[i].MENUITEMDESC;
            a.href=data.level1[i].URL;
            li.appendChild(a);
            menu.appendChild(li);
        }
        var li=document.createElement("li");
        li.innerHTML="取消";
        li.setAttribute("class","cancel");
        menu.appendChild(li);
        cancelmenu();
    });
}
//取消菜单
function cancelmenu(){
    var buttonlist=document.querySelectorAll(".dataBox table button");
    var settingmenu=document.getElementById("setting");
    var cancel=document.querySelectorAll(".cancel")[0];
    var tbody=document.querySelectorAll(".dataBox table tbody")[0];
    cancel.addEventListener("click",function(){
         settingmenu.style.top=-1000+'px';
        document.querySelectorAll(".operate")[0].setAttribute("class","");
        tbody.style.overflow="auto";
        document.querySelectorAll(".tablewrap")[0].style.overflowX="auto";
    });
}
//设置菜单
function togglesetting(){
    var buttonlist=document.querySelectorAll(".dataBox table button");
    var settingmenu=document.getElementById("setting");
    var tbody=document.querySelectorAll(".dataBox table tbody")[0];
    var cancel=document.querySelectorAll(".cancel")[0];
    var datepicker=document.getElementById("datepicker");
    var dateselector=document.querySelectorAll(".dateselector")[0];
    for(var i=0;i<buttonlist.length;i++){
        buttonlist[i].addEventListener("click",function(){
            if(this.innerHTML=="操作"){
                generatemenu();
                 settingmenu.style.top=this.getBoundingClientRect().top+document.body.scrollTop+'px';
                tbody.style.overflow="hidden";
                document.querySelectorAll(".tablewrap")[0].style.overflowX="hidden";
                var current=document.querySelectorAll(".operate")[0]
               if(current){
                   current.setAttribute("class","");
               }
                this.parentNode.parentNode.setAttribute("class","operate");
            }else if(this.innerHTML=="预约"){
                if(document.querySelectorAll(".activebutton")[0]){
                    document.querySelectorAll(".activebutton")[0].setAttribute("class","");
                     datepicker.style.top=-1000+'px';
                    tbody.style.overflow="auto";
                    document.querySelectorAll(".tablewrap")[0].style.overflowX="hidden";
                }
                else{
                    datepicker.style.top=this.getBoundingClientRect().top+document.body.scrollTop+'px';
                    this.setAttribute("class","activebutton");
                    tbody.style.overflow="hidden";
                    document.querySelectorAll(".tablewrap")[0].style.overflowX="auto";
                }
            }
               
        })
    }
}

//调用时间选择控件
function calldate(){
    var year=document.getElementById("year");
    var month=document.getElementById("month");
    var increaseyear=document.getElementById("increaseyear");
    var decreaseyear=document.getElementById("decreaseyear");
    var increasemonth=document.getElementById("increasemonth");
    var decreasemonth=document.getElementById("decreasemonth");
   var dateinput=document.querySelectorAll("#datepicker>input");
    var dateselector=document.querySelectorAll(".dateselector")[0];
    for(var i=0;i<dateinput.length;i++){
        dateinput[i].addEventListener("click",function(){
            dateselector.style.display="block";
            dateselector.style.top=this.offsetTop+40+'px';
              setdate();//设定为当前时间
              settime.call(this);
        })
    }
    increaseyear.addEventListener("click",function(){
        year.innerHTML=year.innerHTML/1+1;
        detectmonth();
    });
    decreaseyear.addEventListener("click",function(){
        year.innerHTML=year.innerHTML/1-1;
        detectmonth();
    });
    increasemonth.addEventListener("click",function(){
        month.innerHTML=((month.innerHTML/1+1)<=12)?month.innerHTML/1+1:12;
        detectmonth();
    });
    decreasemonth.addEventListener("click",function(){
        month.innerHTML=(month.innerHTML/1-1)||1;
        detectmonth();
    })
}
//设定为当前时间
function setdate(){
    var date=new Date();
    var currentyear=date.getFullYear();
    var currentmonth=date.getMonth();
    var currenthour=date.getHours();
    var currentsecond=date.getSeconds();
    var currentminute=date.getMinutes();
    var hour=document.getElementById("hour");
    var minute=document.getElementById("minute");
    var second=document.getElementById("second");
     var year=document.getElementById("year");
    var month=document.getElementById("month");
    year.innerHTML=currentyear;
    month.innerHTML=currentmonth+1;
    hour.value=currenthour;
    minute.value=(currentminute<10)?('0'+currentminute):currentminute;
    second.value=currentsecond;
}

//判断闰年及大小月
function detectmonth(){
    var month=document.getElementById("month").innerHTML/1;
    var year=document.getElementById("year").innerHTML/1;
    var daylist=document.querySelectorAll(".daylist button");
    var bigmonth=[1,3,5,7,8,10,12];
    var smallmonth=[4,6,9,11];
    if(bigmonth.indexOf(month)!==-1){
        daylist[30].style.opacity=1;
        daylist[30].disabled=false;
         daylist[29].style.opacity=1;
        daylist[29].disabled=false;
         daylist[28].style.opacity=1;
        daylist[28].disabled=false;
    }else if(smallmonth.indexOf(month)!==-1){
         daylist[30].style.opacity=0;
         daylist[30].disabled=true;
        daylist[29].style.opacity=1;
        daylist[29].disabled=false;
         daylist[28].style.opacity=1;
        daylist[28].disabled=false;
    }else{
         daylist[30].style.opacity=0;
         daylist[30].disabled=true;
         daylist[29].style.opacity=0;
         daylist[29].disabled=true;
         if(year%100){
             if(!(year%4)){
                 daylist[28].style.opacity=0;
                  daylist[28].disabled=true;
             }else{
                  daylist[28].style.opacity=1;
                  daylist[28].disabled=false;
             }
         }else{
             if(!(year%400)){
                 daylist[28].style.opacity=0;
                  daylist[28].disabled=true;
             }else{
                 daylist[28].style.opacity=1;
                 daylist[28].disabled=false;                 
             }
         }
    }
}

//设定为设定时间
function settime(){
    var dateselector=document.querySelectorAll(".dateselector")[0];
    var input=this;
   var daylist=document.querySelectorAll(".daylist button");
    for(var i=0;i<daylist.length;i++){
        daylist[i].addEventListener("click",function(){
            var hour=document.getElementById("hour").value;
            var minute=document.getElementById("minute").value;
            var second=document.getElementById("second").value;
            var year=document.getElementById("year").innerHTML;
            var month=document.getElementById("month").innerHTML;
            var date=year+'-'+((month<10)?('0'+month):month)+'-'+((this.innerHTML<10)?('0'+this.innerHTML):this.innerHTML)+' '+((hour<10)?('0'+hour):hour)+':'+((minute<10)?('0'+minute):minute)+':'+((second<10)?('0'+second):second);
            input.value=date;
            dateselector.style.display="none";
            input=null;
        })
    }
}

//修改时间
function editdate(){
    var editbutton=document.querySelectorAll("img[src='img/edit.png']");
    for(var i=0;i<editbutton.length;i++){
        editbutton[i].addEventListener("click",function(){
            var input=this.parentNode.firstChild;
            input.disabled=!input.disabled;
            if(input.disabled){
                input.style.border="none";
                input.style.backgroundColor="rgba(1,1,1,0)";
            }else{
                input.style.border="1px solid rgb(200,200,200)";
                input.style.backgroundColor="white";
            }
        })
    }
}
//检测状态
function detectstate(){
    var statelist=document.querySelectorAll(".dataBox table tr td:nth-child(9)");
    for(var i=0;i<statelist.length;i++){
        if(statelist[i].innerHTML=="失败"){
            statelist[i].style.color="rgb(240,100,100)";
        }
    }
    var datelist=document.querySelectorAll(".dataBox table tr td:nth-child(2)");
    for(var j=0;j<datelist.length;j++){
        if(datelist[j].innerHTML=="到达"){
            datelist[j].style.color="rgb(240,100,100)";
        }
    }
}

//隐藏二级tab
function hidesecondtab(){
    var secondtab=document.getElementById("secondtab");
    secondtab.addEventListener("mouseleave",function(){
        secondtab.style.left="-1000px";
    })
}