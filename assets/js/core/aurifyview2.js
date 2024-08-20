// import { readSpreadValues } from '../core/spotrateDB.js';
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';
import { USER_ID } from '../../../global/global.js'

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js';
document.head.appendChild(script);

const socket = io('https://capital-server-9ebj.onrender.com', {
    query: { secret: 'aurify@123' }, // Pass secret key as query parameter
});

const firestore = getFirestore(app)

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    requestMarketData(["GOLD", "SILVER"]);
});

// Request market data based on symbols
function requestMarketData(symbols) {
    socket.emit("request-data", symbols);
}

setInterval(fetchData1, 500);

setInterval(() => {
    fetchData();
}, 500)

// fetchData();
showTable();

let askSpread,
    bidSpread,
    silverBidSpread,
    silverAskSpread,
    goldBuy,
    goldAskingPrice,
    goldBiddingPrice,
    goldSell,
    silverBuy,
    silverSell,
    silverValue,
    goldHigh,
    goldLow,
    silverLow,
    silverHigh,
    silverAskingPrice,
    silverBiddingPrice;

let goldData = {};
let silverData = {};

async function fetchData() {
    socket.on('market-data', (data) => {
        // console.log('Received gold value:', data);

        if (data && data.symbol) {
            if (data.symbol === "Gold") {
                goldData = data;
                // updateGoldUI();
            } else if (data.symbol === "Silver") {
                silverData = data;
            }
        } else {
            console.warn("Received malformed market data:", data);
        }


        const value = goldData.bid;
        goldHigh = goldData.high;
        goldLow = goldData.low;
        goldBuy = (value + bidSpread).toFixed(2);
        goldSell = (value + bidSpread + askSpread + parseFloat(0.5)).toFixed(2);

        const value2 = silverData.bid;
        silverHigh = silverData.high;
        silverLow = silverData.low;
        silverBuy = (value2 + silverBidSpread).toFixed(2);
        silverSell = (value2 + silverBidSpread + silverAskSpread + parseFloat(0.5)).toFixed(2);
    });

    var goldBuyUSD = (goldBuy / 31.103).toFixed(4);
    goldBiddingPrice = (goldBuyUSD * 3.674).toFixed(4);

    var goldSellUSD = (goldSell / 31.103).toFixed(4);
    goldAskingPrice = (goldSellUSD * 3.674).toFixed(4);

    var silverBuyUSD = (silverBuy / 31.103).toFixed(4);
    silverBiddingPrice = (silverBuyUSD * 3.674).toFixed(4);

    var silverSellUSD = (silverSell / 31.103).toFixed(4);
    silverAskingPrice = (silverSellUSD * 3.674).toFixed(4);
}

// Function to Fetch Gold API Data
async function fetchData1() {
    try {
        var currentGoldBuy = goldBuy;
        var currentGoldSell = goldSell;
        var currentSilverBuy = silverBuy;
        var currentSilverSell = silverSell;

        function updatePrice() {
            var newGoldBuy = goldBuy ? goldBuy : 0;
            var newGoldSell = goldSell ? goldSell : 0;
            var newSilverBuy = silverBuy ? silverBuy : 0;
            var newSilverSell = silverSell ? silverSell : 0;

            var element1 = document.getElementById("goldInputLow");
            var element2 = document.getElementById("goldInputHigh");
            var element3 = document.getElementById("silverInputLow");
            var element4 = document.getElementById("silverInputHigh");

            element1.innerHTML = newGoldBuy ? newGoldBuy : 0;
            element2.innerHTML = newGoldSell ? newGoldSell : 0;
            element3.innerHTML = newSilverBuy ? newSilverBuy : 0;
            element4.innerHTML = newSilverSell ? newSilverSell : 0;

            // Determine color for each element
            var color1;
            var fontColor1;
            if (newGoldBuy > currentGoldBuy) {
                color1 = "green";
                fontColor1 = "white"
            } else if (newGoldBuy < currentGoldBuy) {
                color1 = "red";
                fontColor1 = "white"
            } else {
                color1 = "white"; // Set to white if no change
                fontColor1 = "black"
            }

            var color2;
            var fontColor2;
            if (newGoldSell > currentGoldSell) {
                color2 = "green";
                fontColor2 = "white"
            } else if (newGoldSell < currentGoldSell) {
                color2 = "red";
                fontColor2 = "white"
            } else {
                color2 = "white"; // Set to white if no change
                fontColor2 = "black"
            }

            var color3;
            var fontColor3;
            if (newSilverBuy > currentSilverBuy) {
                color3 = "green";
                fontColor3 = "white"
            } else if (newSilverBuy < currentSilverBuy) {
                color3 = "red";
                fontColor3 = "white"
            } else {
                color3 = "white"; // Set to white if no change
                fontColor3 = "black"
            }

            var color4;
            var fontColor4;
            if (newSilverSell > currentSilverSell) {
                color4 = "green";
                fontColor4 = "white"
            } else if (newSilverSell < currentSilverSell) {
                color4 = "red";
                fontColor4 = "white"
            } else {
                color4 = "white"; // Set to white if no change
                fontColor4 = "black"
            }

            element1.style.backgroundColor = color1;
            element2.style.backgroundColor = color2;
            element3.style.backgroundColor = color3;
            element4.style.backgroundColor = color4;

            element1.style.color = fontColor1;
            element2.style.color = fontColor2;
            element3.style.color = fontColor3;
            element4.style.color = fontColor4;


            currentGoldBuy = newGoldBuy ? newGoldBuy : 0;
            currentGoldSell = newGoldSell ? newGoldSell : 0;
            currentSilverBuy = newSilverBuy ? newSilverBuy : 0;
            currentSilverSell = newSilverSell ? newSilverSell : 0;

            setTimeout(updatePrice, 300);
        }


        updatePrice();

        document.getElementById("lowLabelGold").innerHTML = goldLow ? goldLow : 0;
        document.getElementById("highLabelGold").innerHTML = goldHigh ? goldHigh : 0;
        document.getElementById("lowLabelSilver").innerHTML = silverLow ? silverLow : 0;
        document.getElementById("highLabelSilver").innerHTML = silverHigh ? silverHigh : 0;

        var element;

        // LowLabelGold
        element = document.getElementById("lowLabelGold");
        element.style.backgroundColor = "red";

        // HighLabelGold
        element = document.getElementById("highLabelGold");
        element.style.backgroundColor = "green";

        // LowLabelSilver
        element = document.getElementById("lowLabelSilver");
        element.style.backgroundColor = "red";

        // HighLabelSilver
        element = document.getElementById("highLabelSilver");
        element.style.backgroundColor = "green";
    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
}


async function readSpreadValues() {
    try {
        const uid = USER_ID;
        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        const spreadCollection = collection(firestore, `users/${uid}/spread`);
        const querySnapshot = await getDocs(spreadCollection);

        const spreadDataArray = [];
        querySnapshot.forEach((doc) => {
            const spreadData = doc.data();
            const spreadDocId = doc.id;
            spreadDataArray.push({ id: spreadDocId, data: spreadData });
        });

        // console.log(spreadDataArray);

        return spreadDataArray;
    } catch (error) {
        console.error('Error reading data from Firestore: ', error);
        throw error;
    }
}

async function displaySpreadValues() {
    try {
        const spreadDataArray = await readSpreadValues();

        spreadDataArray.forEach((spreadData) => {
            askSpread = spreadData ? spreadData.data.editedAskSpreadValue : 0;
            bidSpread = spreadData ? spreadData.data.editedBidSpreadValue : 0;
            silverAskSpread = spreadData ? spreadData.data.editedAskSilverSpreadValue : 0;
            silverBidSpread = spreadData ? spreadData.data.editedBidSilverSpreadValue : 0;
        });
    } catch (error) {
        console.error('Error reading spread values: ', error);
        throw error;
    }
}

async function readData() {
    // Get the UID of the authenticated user
    const uid = USER_ID;

    if (!uid) {
        console.error('User not authenticated');
        return 'User not authenticated';
    }

    try {

        const querys = await query(
            collection(firestore, `users/${uid}/commodities`),
            orderBy("timestamp", "asc") // Sort by timestamp in ascending order
        )
        const querySnapshot = await getDocs(querys);

        const result = [];

        querySnapshot.docs.forEach((doc) => {
            result.push({
                id: doc.id,
                data: doc.data()
            })
        });

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function showTable() {
    try {
        const tableData = await readData();
        const tableBody = document.getElementById('tableBodyTV');

        // Loop through the tableData
        for (const data of tableData) {
            // Assign values from data to variables
            const metalInput = data.data.metal;
            const purityInput = data.data.purity;
            const unitInput = data.data.unit;
            const weightInput = data.data.weight;
            const sellAEDInput = data.data.sellAED;
            const buyAEDInput = data.data.buyAED;
            const sellPremiumInputAED = data.data.sellPremiumAED;
            const buyPremiumInputAED = data.data.buyPremiumAED;

            let metal, purity;
            if (weightInput === 'TTB') {
                metal = 'GOLD'
                purity = 'TEN TOLA'
            } else {
                metal = metalInput
                purity = purityInput
            }

            // Create a new table row for data
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td colspan="2" style="text-align: center;">${metal} <span style="font-size: 25px;">${purity}</span></td>
                <td>${unitInput} ${weightInput}</td>
                <td id="buyAED">0</td>
                <td id="sellAED">0</td>
            `;
            // Append the new row to the table body
            tableBody.appendChild(newRow);

            // Create an empty row (if not the last row)
            if (data !== tableData[tableData.length - 1]) {
                tableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="5" style="height: 7px;"></td></tr>');
            }

            displaySpreadValues();

            setInterval(async () => {
                let weight = weightInput;
                let unitMultiplier = 1;

                // Adjust unit multiplier based on the selected unit
                if (weight === "GM") {
                    unitMultiplier = 1;
                } else if (weight === "KG") {
                    unitMultiplier = 1000;
                } else if (weight === "TTB") {
                    unitMultiplier = 116.6400;
                } else if (weight === "TOLA") {
                    unitMultiplier = 11.664;
                } else if (weight === "OZ") {
                    unitMultiplier = 31.1034768;
                }


                let sellPremium = sellPremiumInputAED || 0;
                let buyPremium = buyPremiumInputAED || 0;

                // if (weight === "GM") {

                //     // Update the sellAED and buyAED values for the current 
                //     newRow.querySelector("#sellAED").innerText = parseFloat((goldAskingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(sellPremium)).toFixed(2));
                //     newRow.querySelector("#buyAED").innerText = (goldBiddingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(buyPremium)).toFixed(2);
                // } else {
                //     // Update the sellAED and buyAED values for the current row
                //     const sellAEDValue = parseFloat((goldAskingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(sellPremium)).toFixed(4));
                //     const buyAEDValue = parseInt(goldBiddingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(buyPremium)).toFixed(0);

                //     newRow.querySelector("#sellAED").innerText = parseInt(sellAEDValue).toFixed(0); // Round to remove decimals
                //     newRow.querySelector("#buyAED").innerText = parseInt(buyAEDValue).toFixed(0);   // Round to remove decimals
                // }
                if (weight === "GM") {
                    // Update the sellAED and buyAED values for the current
                    const sellAED = parseFloat(
                        (
                            goldAskingPrice *
                            unitInput *
                            unitMultiplier *
                            (purityInput / Math.pow(10, purityInput.length)) +
                            parseFloat(sellPremium)
                        ).toFixed(2)
                    );
                    const buyAED = parseFloat(
                        (
                            goldBiddingPrice *
                            unitInput *
                            unitMultiplier *
                            (purityInput / Math.pow(10, purityInput.length)) +
                            parseFloat(buyPremium)
                        ).toFixed(2)
                    );

                    newRow.querySelector("#sellAED").innerText = sellAED ? sellAED : 0;
                    newRow.querySelector("#buyAED").innerText = buyAED ? buyAED : 0;
                } else {
                    // Update the sellAED and buyAED values for the current row
                    const sellAEDValue = parseFloat(
                        (
                            goldAskingPrice *
                            unitInput *
                            unitMultiplier *
                            (purityInput / Math.pow(10, purityInput.length)) +
                            parseFloat(sellPremium)
                        ).toFixed(4)
                    );
                    const buyAEDValue = parseFloat(
                        (
                            goldBiddingPrice *
                            unitInput *
                            unitMultiplier *
                            (purityInput / Math.pow(10, purityInput.length)) +
                            parseFloat(buyPremium)
                        ).toFixed(4)
                    );

                    newRow.querySelector("#sellAED").innerText =
                        parseInt(sellAEDValue ? sellAEDValue : 0).toFixed(0); // Round to remove decimals
                    newRow.querySelector("#buyAED").innerText =
                        parseInt(buyAEDValue ? buyAEDValue : 0).toFixed(0); // Round to remove decimals
                }


            }, 500)
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}
