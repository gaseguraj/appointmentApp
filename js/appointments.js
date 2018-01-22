$(document).ready(
    getAppointments()
 );

 /*
* Show messages
*/
function showMessage(msg){
    $("#messageSpace").empty();
    $("#messageSpace").fadeIn("slow");
    $("#messageSpace").append(msg);
    setTimeout(	function(){
            $("#messageSpace").fadeOut( "slow" )
        }, 5000);
}

 var successMsg = "<div class='alert alert-success'><strong>Success!</strong> </div>";
 var errorMsg = "<div class='alert alert-warning'> <strong>Warning!</strong> All fields are required.</div>";

 //Set today's date to Time Field min property 
function minDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd < 10){
        dd = '0' + dd
    } 
    if(mm < 10){
        mm = '0' + mm
    } 
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("dateField").setAttribute("min", today);
}

//Return correct date format for backend
function getDateTime(dateValue, timeValue){
    dateValue = dateValue.split("-");
    var year = dateValue[0];
    var month = dateValue[1];
    var day = dateValue[2];
    return  year + "-" + month + "-" + day + " " + timeValue;
}

function clearForm(){
    $('#dateField').val('');
    $('#timeField').val('');
    $('#descField').val('');
}

//Submit form
function submitForm(){
    var dateValue = $('#dateField').val();
    var timeValue = $('#timeField').val();
    var descValue = $('#descField').val();
    if(dateValue == "" || timeValue == "" || descValue == ""){
        showMessage(errorMsg);
    }else{
        var dateTimeValue = getDateTime(dateValue, timeValue);
        $.ajax({
            url: "http://localhost/cgi-bin/appointments_backend.cgi",
            type: "get", 
            async: true,  
            data: { 
            action: "create",
            date: dateTimeValue,
            detail: descValue
            },
            success: function(data) {
                showMessage(successMsg);
                clearForm();
                getAppointments();
            },
            error: function(xhr) {
            }
        });
    }
}

//Add button click
$('#btnAdd').on('click',  function() {
    if($('#btnAdd').val() == "Add"){
        submitForm();
    }else{
        $('#btnAdd').val("Add");
        $('#btnCancel').show("slow");
        $('#form').show("slow");
    }
 });

 //Cancel button click
 $('#btnCancel').on('click',  function() {
    $('#btnAdd').val("New");
    $('#btnCancel').hide("slow");
    $('#form').hide("slow");
 });

 //Search button click
 $('#btnSearch').on('click',  function() {
    getAppointments();
 });

 //Retieve appointments from backend
 function getAppointments() {	
    minDate();
    var parameter = $('#param').val();
    $.ajax({
        url: "http://localhost/cgi-bin/appointments_backend.cgi",
        type: "get", 
        async: true,  
        data: { 
          action: "retrieve",
          param: parameter
        },
        success: function(data) {
            retrieveData(data)
        },
        error: function(xhr) {
        }
      });
}

//Display data
function retrieveData(data){
    $("#dataTable").empty();
    let postArr = JSON.parse(data); 
    let ids = "";
    for (let x in postArr){
        let divFirst = "";
        if(x % 2 == 0)
            divFirst = $('<div>', { class : 'row row-padded' });    
        else
            divFirst = $('<div>', { class : 'row ' });    
        let divDate = $('<div>', { class : 'col-sm-4' });
        let divDetail = $('<div>', { class : 'col-sm-8' });
        
        let detailData = $('<span>', {
            class	:	'',
            text	:	postArr[x].detail
        });
        let dateData = $('<span>', {
            class	:	'',
            text	:	postArr[x].date
        });

        if(x == 0){
            let title1 = $('<span>', {
                class	:	'h3',
                text	:	"Date / Time"
            });
    
            let title2 = $('<span>', {
                class	:	'h3',
                text	:	"Description"
            });

            let divFirstTitle = $('<div>', { class : 'row' });
            let divDateTitle = $('<div>', { class : 'col-sm-4' });
            let divDetailTitle = $('<div>', { class : 'col-sm-8' });
            $(divDateTitle).html(title1);
            $(divDetailTitle).html(title2);
            $(divFirstTitle).append(divDateTitle).append(divDetailTitle);
            $(dataTable).append(divFirstTitle);
        }
        
        $(divDate).html(dateData);
        $(divDetail).html(detailData);

        $(divFirst).append(divDate).append(divDetail);
        $(dataTable).append(divFirst);
    }
}



