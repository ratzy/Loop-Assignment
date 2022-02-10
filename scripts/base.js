$(document).ready(function(){
    hamburgerMenu();
    timeLine();
    getteamData();
    loadMoreteamData();
    filterTeamMember();
});
//Mobile Menu
function hamburgerMenu(){
    $(document).on('click','.hamburger-menu', function(){
     $('body').toggleClass('show-menu');
    });
}

//Timline click and check the related content
function timeLine(){
  var ele, eleIndex;
    $(document).on('click', '.timeline-item', function(){
      ele=$(this);
      eleIndex=ele.index()+1;
      ele.closest('.timeline-list').find('.timeline-item').removeClass('selected');
      ele.closest('.timeline-journey-wrapper').find('.para-item').removeClass('selected');
      ele.addClass('selected');
      ele.closest('.timeline-journey-wrapper').find('.para-item:nth-child('+eleIndex+')').addClass('selected');
    });
}

//Calling the Team JSON
var teamData;
function getteamData(){
    $.getJSON("./scripts/sailor_team.json", function (data) {
            console.log("success call");
            teamData = data;
        })
        .done(function () {
            console.log("success");
            console.log(teamData);
            generateTeamList(teamData, teamStartCount, teamLoadCount); //Generating team list
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}

var filterSet=[];
var checlLoadMoreBtnTime;
var teamStartCount=1, teamLoadCount=10;
//START: Generatig Team List
function generateTeamList(teamData, teamStartCount, teamLoadCount) {
    clearTimeout(checlLoadMoreBtnTime);
    var posinset, totalTeamLength, setSize = teamData.length;
    totalTeamLength = teamData.length;

    if(teamLoadCount > totalTeamLength){
        teamLoadCount = totalTeamLength - teamStartCount;
    }

    for (var i = teamStartCount; i < teamStartCount + teamLoadCount; i++) {
        posinset = i;
        $('.team-list').append('<li class="tab-content-item team-item" role="option" aria-setsize=' + setSize + ' aria-posinset=' + posinset + ' filter-set=' + teamData[i].duty_slugs + '><img src="production/assets/images/team/'+posinset+'.png" alt="'+teamData[i].name+'" class="full-width"/><div class="tab-content-details"><h4>' + teamData[i].name + '</h4> <p>' + teamData[i].duties + '</p></div></li>');
        filterSet.push(teamData[i].duty_slugs);
    }
     
    if($(".team-wrapper .tab-item").length == 1){
       removeDuplicates(filterSet);
   }

    var teamFetchedCount = $('.team-list .team-item').length;
    if(teamFetchedCount==totalTeamLength-1){
        $('.load-more-btn').addClass('disabled');
    }
}  

//Load More Team Member
function loadMoreteamData(){
    $(document).on('click','.load-more-btn', function(){
        clearTimeout(checlLoadMoreBtnTime);
        var teamFetchedCount = $('.team-list .team-item').length;
        teamStartCount = teamFetchedCount +1;
        teamLoadCount = teamStartCount+10;
        generateTeamList(teamData, teamStartCount,teamLoadCount);
   });
} 

//Remove duplicate value form the array list for the filter tab
function removeDuplicates(filterSet){
    const toOneArray = [].concat(...filterSet);
    const amendedArray = toOneArray.filter((el, i) => toOneArray.indexOf(el)===i);
    console.log('After Filteration', amendedArray);
    generateTabList(amendedArray);
}

//Generating Tab List for the Team
function generateTabList(amendedArray){
    var posinset; setSize = amendedArray.length
    for (var i=0; i<setSize; i++){
        posinset=i;
        $('.team-wrapper .tab-list').append('<li class="tab-item" role="option" aria-setsize=' + (setSize+1) + ' aria-posinset=' + (posinset+1) + '>'+amendedArray[i]+'</li>"');
    }
}

//Filter Team list based on their duties
function filterTeamMember(){
    var filterType, totalTeamMemberShown; 
    $(document).on('click','.team-wrapper .tab-item', function(){
     $(this).closest('.tab-list').find('.tab-item').removeClass('selected');
     $(this).addClass('selected');
      totalTeamMemberShown= $('.team-list .team-item').length;
      filterType=$(this).text().trim();
      $('.team-list .team-item').removeClass('hidden');
      $('.team-list').append($('.hide-temmember-list').html());
      $('.hide-temmember-list').html('');

      if(filterType!="Show all"){
            for(var i=1; i<=totalTeamMemberShown; i++){
                totalTeamMemberShown= $('.team-list .team-item').length;
                teamMemberDutyArr=[];
                teamMemberDutyArr.push($('.team-list .team-item:nth-child('+i+')').attr('filter-set').replace(/,/g, ' '));
                console.log(teamMemberDutyArr);
                if(!teamMemberDutyArr[0].includes(filterType)){
                    var hiddeTemMember=$('.team-list .team-item:nth-child('+i+')')[0].outerHTML;
                    $('.team-list .team-item:nth-child('+i+')').addClass('hidden');
                    $('.hide-temmember-list').append(hiddeTemMember); //Stroing the filtered item locally
                }
            }
            $('.team-list .team-item.hidden').remove();
       }
    });
}










