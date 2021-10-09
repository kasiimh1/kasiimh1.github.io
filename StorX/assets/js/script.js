window.onload = function () {
    getTokenPrice();
    checkCache();
    modeToggle(localStorage.getItem("mode"));
}

function modeToggle(appearance){
if (localStorage.getItem("mode") == 0 || localStorage.getItem("mode") == null) {
  document.body.style.background = "#fff";
  document.body.style.color = "#333";   
  document.getElementById("mode").innerHTML = '<button class="btn btn-dark float-right" onclick="modeToggle(1);window.location.reload();">&#x263e;</button>';
  localStorage.setItem("mode", appearance);
}

else {
  document.body.style.background = "#333";
  document.body.style.color = "#fff";   
  document.getElementById("mode").innerHTML = '<button class="btn btn-light float-right" onclick="modeToggle(0);window.location.reload();">&#x263C;</button>';
  localStorage.setItem("mode", appearance);
  }
}

function checkCache(){
  if (localStorage.getItem("cache") == null){
    document.getElementById("cacheBtn").innerHTML = '<button type="button" class="btn btn-success mb-2" onclick="cacheAddress()">Save Address</button>';
  }
  else   
    document.getElementById("cacheBtn").innerHTML = '<button type="button" class="btn btn-success mb-2" onclick="loadAddress()">Load Cached Address</button> <button type="button" class="btn btn-danger mb-2" onclick="localStorage.clear(); window.location.reload();">Clear Cached Address</button>';
}

function loadAddress(){
  walletAdd.value = localStorage.getItem("cache");
}

function getTokenPrice(){
    fetch("https://farmerapi.storx.io/get-asset-price").then(res => res.text()).then(data => {
    data = JSON.parse(data);
      document.getElementById("price").innerHTML = "Current Prices: <br> SRXUSDT: $" +  data['data']['SRXUSDT'] + " -- XDCUSDT: $" + data['data']['XDCUSDT'];
    })
}

function cacheAddress(){
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem("cache") == null){
        console.log("[SAVE TO CACHE]", walletAdd.value);
        localStorage.setItem("cache", walletAdd.value);
        window.location.reload();
        alert("[Cached] XDC Address: " + walletAdd.value);
      }
    }
  }

  function fetchData(){
    getTokenPrice();
    if (document.getElementById("walletAdd").value != "") {
      document.getElementById("walletInfo").innerHTML = "";
      fetch("https://farmerapi.storx.io/get-contract-data").then(res => res.text()).then(data => {
      data = JSON.parse(data);
      address = walletAdd.value.toLowerCase().replace("xdc", "0x");
      if (data['data']['stakeHolders'][address] != null) {
      document.getElementById("walletInfo").innerHTML += "<br>---Found Contract Data!---<br><br>Contract Address: " + address;
      document.getElementById("walletInfo").innerHTML += "<br>StorX Node Reputation: " + data['data']['stakeHolders'][address]['reputation'];
      if (data['data']['stakeHolders'][address]['reputation'] >= 10)
        document.getElementById("walletInfo").innerHTML += "<br>Farmer Status: <span style='color:green;'>True!</span>";
      else
        document.getElementById("walletInfo").innerHTML += "<br>Farmer Node Status: <span style='color:red;'>False!</span>";
      document.getElementById("walletInfo").innerHTML += "<br><br>Staked SRX: " + data['data']['stakeHolders'][address]['stake']['stakedAmount']/10**18;
      document.getElementById("walletInfo").innerHTML += "<br>Claimable SRX Balance: " + data['data']['stakeHolders'][address]['stake']['balance'];
      document.getElementById("walletInfo").innerHTML += "<br>SRX Total Redeemed: " + data['data']['stakeHolders'][address]['stake']['totalRedeemed']/10**18;
      document.getElementById("walletInfo").innerHTML += "<br><br>Date SRX Staked: " + moment(data['data']['stakeHolders'][address]['stake']['stakedTime'] * 1000).format("LLL");   
      document.getElementById("walletInfo").innerHTML += "<br>Rewards Last Redeemed On " + moment(data['data']['stakeHolders'][address]['stake']['lastRedeemedAt'] * 1000).format("LLL");    
      document.getElementById("walletInfo").innerHTML += "<br>Next Rewards Redeemable from " + moment(data['data']['stakeHolders'][address]['stake']['lastRedeemedAt'] * 1000).add(30, "days").format("LLL");
      document.getElementById("walletInfo").innerHTML += "<br><br>Block Explorer Link: " + "<a href='https://explorer.xinfin.network/addr/"+ address.replace("0x", "xdc") + "'>https://explorer.xinfin.network/addr/"+ address.replace("0x", "xdc") + "</a>";
      }
      else {
        document.getElementById("walletInfo").innerHTML += "<br>---No Contract Data Found!---<br>XDC Address: " + address;
        document.getElementById("walletInfo").innerHTML += "<br>Reputation is below 1, Check back soon!";
      }
  }) }
  else
    alert("Address is needed to perform contract lookup");
}