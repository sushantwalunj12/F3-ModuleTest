let iptitle = document.querySelector("#ip-title");
let getdatabtn = document.querySelector("#get-d");
let useripaddress = "";
let searchbar = document.querySelector("input[type=search]");
let postoffices = [];

//fetching ip address and storing it in global variable and then displaying the
// button after fething ip address
$.getJSON("https://api.ipify.org?format=json", function (data) {
    useripaddress = data.ip;
    document.querySelector(".loader").style.display = "none";
    iptitle.innerHTML = `My Public IP Address: ${useripaddress}`;
    getdatabtn.style.display ="inline-block";
    console.log(useripaddress);
});

getdatabtn.addEventListener("click", () => {
    let url = `https://ipinfo.io/${useripaddress}/geo?token=6370439e94bf29`;
    
    fetch(url).then((response) => {
        return response.json();
    }).then((jsonResponse) => {
        setdetails(jsonResponse);
    }).catch((err) => {
        console.log(err);
    });

    getdatabtn.style.display = "none";

});


function setdetails(jsonResponse){

    console.log(jsonResponse);
    let latitude = jsonResponse.loc.split(",")[0];
    let longitude = jsonResponse.loc.split(",")[1];
    document.querySelector(".pos-cont").style.display = "flex";

    document.querySelector(".coord>span:nth-child(1)").innerHTML = `<strong>Lat:</strong> ${latitude}`;
    document.querySelector(".coord>span:nth-child(2)").innerHTML = `<strong>Long:</strong> ${longitude}`;
    document.querySelector(".region-cont>span:nth-child(1)").innerHTML = `<strong>City:</strong> ${jsonResponse.city}`;
    document.querySelector(".region-cont>span:nth-child(2)").innerHTML = `<strong>Region:</strong> ${jsonResponse.region}`;
    document.querySelector(".org-cont>span:nth-child(1)").innerHTML = `<strong>Organisation:</strong> ${jsonResponse.org}`;
    document.querySelector(".org-cont>span:nth-child(2)").innerHTML = `<strong>Hostname:</strong> ${jsonResponse.hostname}`;

    let myiframe = document.querySelector("iframe");
    myiframe.style.display = "block";
    myiframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en;z=20&output=embed`;

    //getting time and date from timezone
    let yourdatetime = new Date().toLocaleString("en-US", { timeZone: jsonResponse.timezone });

    document.querySelector(".time-cont").style.display = "block";
    document.querySelector(".time-cont>h2:nth-child(1)").innerHTML = `<strong>Time Zone:</strong> ${jsonResponse.timezone}`
    document.querySelector(".time-cont>h2:nth-child(2)").innerHTML = `<strong>Date And Time:</strong> ${yourdatetime}`
    document.querySelector(".time-cont>h2:nth-child(3)").innerHTML = `<strong>Pincode:</strong> ${jsonResponse.postal}`
    console.log(yourdatetime);

   //fetching postoffices from received pincode
    fetch(`https://api.postalpincode.in/pincode/${jsonResponse.postal}`).then((response) => {
        return response.json();
    }).then((postaljson) => {
        document.querySelector(".time-cont>h2:nth-child(4)").innerHTML = `<strong>Message:</strong> ${postaljson[0].Message}`;
        postoffices = postaljson[0].PostOffice;
        document.querySelector(".searchbar").style.display ="block";
        printpostoffices(postoffices);
    }).catch((err) => {
        console.log(err);
    });
}


function printpostoffices(postoffices){
    
    let str = "";
    for(let postoffice of postoffices){
       str+= `
       <div class="postoff">
       <span>Name: ${postoffice.Name}</span>
       <span>Branch Type: ${postoffice.BranchType}</span>
       <span>Delivery Status: ${postoffice.DeliveryStatus}</span>
       <span>Block: ${postoffice.Block}</span>
       <span>District: ${postoffice.District}</span>
       <span>Division: ${postoffice.Division}</span>       
       </div>
       `;
    }

    document.querySelector(".post-ff-cont").innerHTML = str;
}

searchbar.addEventListener("input", ()=>{
   
    let inpstr = searchbar.value.toLowerCase().trim();
   
    let filterarray = [];

    filterarray = postoffices.filter((postoffice)=>{
        return (postoffice.Name.toLowerCase().includes(inpstr) || postoffice.BranchType.toLowerCase().includes(inpstr)
                 || postoffice.Block.toLowerCase().includes(inpstr) || postoffice.District.toLowerCase().includes(inpstr));
    });

    printpostoffices(filterarray);
});