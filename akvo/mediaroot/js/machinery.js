/*
Akvo RSR is covered by the GNU Affero General Public License, see more details in the license.txt file located at the root folder of the Akvo RSR module. 
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html
*/


function getHeight(widget_type) 
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 840; break; 
		case 'project-contribute':  return 570; break; 
		case 'project-updates': 	return 900; break; 
		case 'project-list': 		return 730; break; 
		default: 					return 840;
	}	
}

function getWidth(widget_type)
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 202; break; 
		case 'project-contribute': 	return 202; break; 
		case 'project-updates': 	return 202; break; 
		case 'project-list': 		return 745; break; 
		default: 					return 202;
	}	
}


$(document).ready(function() 
{	
    // Hide customize other and warning section
	$('#backgroundcolor_other_section').hide();
	$('#textcolor_other_section').hide();
	$('#warning_main').hide();
	$('#warning_color').hide();
	
	// Enaable the project / organisation list on the first page	
	$("#feature-side-random-from-org").click(function() { $('#feature-side-organisations').removeAttr("disabled"); });
	$("#feature-side-specific-project").click(function() {	$('#feature-side-organisations').attr("disabled", true); });
	
	$("#project-updates-random-from-org").click(function() { $('#project-updates-organisations').removeAttr("disabled"); });
	$("#project-updates-specific-project").click(function() {	$('#project-updates-organisations').attr("disabled", true); });
	
	$("#project-contribute-random-from-org").click(function() { $('#project-contribute-organisations').removeAttr("disabled"); });
	$("#project-contribute-specific-project").click(function() {	$('#project-contribute-organisations').attr("disabled", true); });
	
	
	
	// Toggle other selections for the colours		
	$("#backgroundcolor_pulldown").change(function() { 
		if (document.getElementById('backgroundcolor_pulldown').value == 'x') {
			$('#backgroundcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			$('#backgroundcolor_other_section').animate({ opacity: "hide" }, "slow");
		}
	});
	
	$("#textcolor_pulldown").change(function() { 		
		if (document.getElementById('textcolor_pulldown').value == 'x') {
			$('#textcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			$('#textcolor_other_section').animate({ opacity: "hide" }, "slow");
		}		
	});
	
	// Preview button
	$(function(){
	 $('#preview').click(function(){
	  $('html, body').animate({ scrollTop: $('#preview_position').offset().top }, 1000);
	   return false;
	 });
	});
	
	
	// Display the default widget preview
	preview_widget();
	
});

// Tries to render the widget as well as generate the copy code
function preview_widget()
{
	
	// Remove old error messages	
	var warning_color = document.getElementById('warning_color');
	if (warning_color.hasChildNodes()) { warning_color.innerHTML = '';}
	
	$('#warning_main').animate({ opacity: "hide" }, "fast"); 
	$('#warning_color').animate({ opacity: "hide" }, "fast"); 
	
	
	// Error checking begins	
	var colorsValidate=true;
	
	
	// Backgroundcolor
	if (document.getElementById('backgroundcolor_pulldown').value == 'x') {
		var bgcolor = document.getElementById('backgroundcolor_text').value;
	} else {
		var bgcolor = document.getElementById('backgroundcolor_pulldown').value;
	}
	
	if (!(bgcolor.length == 3 || bgcolor.length == 6))
	{ 
		$('#warning_color').animate({ opacity: "show" },"slow");
		$('#warning_color').append("A: Hex color values should be 3 or 6 characters.<br />");
		
		colorsValidate=false;
	}
	else if (!hex_validator(bgcolor))
	{
		$('#warning_color').animate({ opacity: "show" }, "slow").append("A: Not a valid hex number.<br />");
		colorsValidate=false;
	}
	
	// Titlecolor
	
	if (document.getElementById('textcolor_pulldown').value == 'x') {
		var txtcolor = document.getElementById('textcolor_text').value;
	} else {
		var txtcolor = document.getElementById('textcolor_pulldown').value;
	}	
	
	if (!(txtcolor.length == 3 || txtcolor.length == 6))
	{ 
		$('#warning_color').animate({ opacity: "show" },"slow");
		$('#warning_color').append("B: Hex color values should be 3 or 6 characters.<br />");
		
		colorsValidate=false;
	}
	else if (!hex_validator(txtcolor))
	{
		//$('#warning_color').append("Not a valid hex number");
		$('#warning_color').animate({ opacity: "show" }, "slow").append("B: Not a valid hex number.<br />");
		colorsValidate=false;
	}
	
	// Main warning
	var akvo_widget_container = document.getElementById('akvo_widget_container');
	var codefield = document.getElementById('code');
	
	if(!colorsValidate) {
		$('#warning_main').animate({ opacity: "show" }, "slow");
		
		//alert('remove widget and copy code');
		if (akvo_widget_container.hasChildNodes()) { 
			akvo_widget_container.innerHTML = '';
		}
		codefield.value="";
		return;
	}
	
	// Create the iframe variables
	var akvo_widget_height = getHeight(akvo_widget_type);
	var akvo_widget_width = getWidth(akvo_widget_type);
	
	if (akvo_widget_choice == 'random-from-org') {
	    var akvo_url = 'http://' + location.host + '/rsr/widget/one-from-organisation/' + akvo_widget_organisation + '/?widget=' + akvo_widget_type;
	    var widget_url = akvo_url + '&bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;
	} else if (akvo_widget_choice == 'project-list') {
	    var akvo_url ='http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/organisation/' + akvo_widget_organisation + '/'
	    var widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;	    
	} else {
	    var akvo_url = 'http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/project/' + akvo_project_id + '/';
	    var widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;
	}
	
	// If the iframe exists update otherwise create the iframe and add it to our anchor div.
	var akvo_widget = document.getElementById('jswidget');
	
	if(akvo_widget) 
	{
		akvo_widget.src = widget_url;
	} 
	else 
	{
		ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", widget_url);
		ifrm.height = akvo_widget_height;
		ifrm.width = akvo_widget_width;
		ifrm.frameBorder = 0;
		ifrm.setAttribute("allowTransparency","true");
		ifrm.setAttribute("id","jswidget");
		document.getElementById('akvo_widget_container').appendChild(ifrm);
	}
	
	// Update the widget code snippet
	// Show code only if valid!!!!
	var codesnippet = '<iframe src="' + widget_url + '" '; 
	codesnippet += 'height="' + akvo_widget_height + '" width="' + akvo_widget_width + '" frameborder="0" allowTransparency="true"> </iframe>';
	codefield.value = codesnippet;
}

function hex_validator(hexcolor) 
{ 
	var strPattern = /^([0-9a-f]{1,2}){3}$/i;
	return strPattern.test(hexcolor);
}


