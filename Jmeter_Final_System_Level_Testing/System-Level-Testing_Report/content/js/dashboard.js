/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.96087344752009, "KoPercent": 22.03912655247991};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35138860175039627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9380753138075314, 500, 1500, "Contact_Synching"], "isController": false}, {"data": [0.44502407704654895, 500, 1500, "Get Logged in User Info"], "isController": false}, {"data": [0.0, 500, 1500, "IBFT_Real"], "isController": false}, {"data": [0.0, 500, 1500, "Dashboard"], "isController": true}, {"data": [0.4365750528541226, 500, 1500, "Add_Beneficiary"], "isController": false}, {"data": [0.945024077046549, 500, 1500, "Get User Account Info"], "isController": false}, {"data": [0.023017902813299233, 500, 1500, "P2P"], "isController": false}, {"data": [0.0, 500, 1500, "Verify_OTP(IBFT)"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction"], "isController": true}, {"data": [0.03089887640449438, 500, 1500, "Get User Account Transactions"], "isController": false}, {"data": [9.165902841429881E-4, 500, 1500, "Verify_TPIN(P2P)"], "isController": false}, {"data": [0.9184430027803522, 500, 1500, "Fetch_Title"], "isController": false}, {"data": [0.7108157653528873, 500, 1500, "Get-Banks"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12319, 2715, 22.03912655247991, 15850.082961279279, 158, 62402, 1177.0, 60173.0, 60497.0, 60653.6, 11.903887630547546, 121.01794427837451, 12.12899189615962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Contact_Synching", 1195, 0, 0.0, 310.90627615062766, 165, 3264, 233.0, 528.4000000000001, 628.6000000000001, 978.2799999999997, 1.2086003800770064, 6.526914161939303, 3.6163589497616684], "isController": false}, {"data": ["Get Logged in User Info", 1246, 0, 0.0, 976.0995184590687, 488, 5625, 822.5, 1564.6, 1917.6499999999999, 2873.479999999997, 1.2511484759786522, 1.1728752096125556, 0.8345062588802924], "isController": false}, {"data": ["IBFT_Real", 1060, 317, 29.90566037735849, 48384.19622641509, 2212, 60562, 52463.0, 60172.0, 60176.0, 60246.33, 1.0889184061110924, 0.4521342832862325, 1.262252097708854], "isController": false}, {"data": ["Dashboard", 1246, 0, 0.0, 8407.052166934187, 1823, 27827, 6257.5, 17158.899999999998, 21171.649999999976, 26971.149999999998, 1.2278269335564311, 113.30612883862204, 2.6355113280830427], "isController": true}, {"data": ["Add_Beneficiary", 946, 0, 0.0, 1369.8065539112047, 197, 9411, 857.5, 2366.3, 5688.099999999999, 7975.239999999997, 1.1122816588752082, 1.060972468236481, 1.1448680356000678], "isController": false}, {"data": ["Get User Account Info", 1246, 0, 0.0, 305.45505617977534, 158, 3597, 206.0, 504.89999999999986, 811.549999999999, 1475.2599999999989, 1.2517090449540353, 1.0891335537637163, 0.8801079222333061], "isController": false}, {"data": ["P2P", 1173, 403, 34.35635123614663, 43181.949701619815, 334, 60607, 53366.0, 60172.0, 60177.3, 60270.12, 1.15779011130775, 0.4711696197059233, 0.928342451156655], "isController": false}, {"data": ["Verify_OTP(IBFT)", 946, 946, 100.0, 41481.439746300115, 1221, 61953, 60481.0, 60554.3, 60786.55, 61068.77, 1.0405197759252762, 0.3392733537431764, 0.8287753592323033], "isController": false}, {"data": ["Transaction", 946, 946, 100.0, 175801.6194503173, 65918, 246195, 178782.0, 226539.90000000002, 231581.1, 235761.72, 1.0369020960548396, 9.368727662007732, 9.325330378957025], "isController": true}, {"data": ["Get User Account Transactions", 1246, 0, 0.0, 7125.497592295348, 713, 26990, 4892.0, 15519.799999999997, 20080.8, 25965.89, 1.2287810905777343, 111.17308950458475, 0.9539853193450182], "isController": false}, {"data": ["Verify_TPIN(P2P)", 1091, 1049, 96.15032080659945, 37593.22273143907, 1145, 62402, 60168.0, 60528.8, 60720.0, 61115.04, 1.1445944925176463, 0.3941039122103368, 0.90612671971126], "isController": false}, {"data": ["Fetch_Title", 1079, 0, 0.0, 331.680259499536, 170, 2311, 222.0, 612.0, 784.0, 1279.600000000001, 1.1389774115128555, 0.4237796814320292, 0.8152907964898595], "isController": false}, {"data": ["Get-Banks", 1091, 0, 0.0, 514.5820348304302, 166, 4460, 516.0, 817.6000000000005, 1001.3999999999999, 1278.6799999999967, 1.143862459713185, 0.9394417271667859, 0.8065123983524607], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 6, 0.22099447513812154, 0.048705252049679355], "isController": false}, {"data": ["504/Gateway Time-out", 1989, 73.25966850828729, 16.145791054468706], "isController": false}, {"data": ["422", 720, 26.519337016574585, 5.844630245961523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12319, 2715, "504/Gateway Time-out", 1989, "422", 720, "400", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["IBFT_Real", 1060, 317, "504/Gateway Time-out", 317, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["P2P", 1173, 403, "504/Gateway Time-out", 403, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Verify_OTP(IBFT)", 946, 946, "504/Gateway Time-out", 629, "422", 317, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Verify_TPIN(P2P)", 1091, 1049, "504/Gateway Time-out", 640, "422", 403, "400", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
