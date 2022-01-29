// var DOMAIN = "http://192.168.0.243:105/";
var DOMAIN = "https://tdtrading.herokuapp.com/";

function populate_pattern_occurances() {
    activateLoader();

    $.ajax({
        url: DOMAIN + "algotrading/get_pattern_occurances",
        type: "GET",
        dataType: 'json',
        success: function(response) {
            for (var index in response) {
                var rowClass = "neutral-class";
                rowClass = response[index]['Trend'] == "Bullish" ? "profit-class" : rowClass
                rowClass = response[index]['Trend'] == "Bearish" ? "loss-class" : rowClass

                var htmlContent = '<tr class="' + rowClass + '">' +
                    '<td>' + response[index]['Slno'] + '</td>' +
                    '<td>' + response[index]['Date'] + '</td>' +
                    '<td>' + response[index]['Name'] + '</td>' +
                    '<td>' + response[index]['Pattern'] + '</td>' +
                    '</tr>';

                $("#pattern-table tbody").append(htmlContent);
            }

            $("#pattern-table").DataTable({
                searching: false,
                info: false,
                "dom": '<"top"f>rt<"bottom"lp><"clear">'
            });

            deactivateLoader();
        }
    });
}

function populate_tickers() {
    $.ajax({
        url: DOMAIN + "algotrading/get_all_tickers",
        type: "GET",
        dataType: 'json',
        success: function(tickers_array) {
            for (var index in tickers_array) {
                var htmlContent = '<option value="' + tickers_array[index] + '">' + tickers_array[index] + '</option>';
                $("#ticker").append(htmlContent);
            }
        }
    });
}

function populate_patterns() {
    $.ajax({
        url: DOMAIN + "algotrading/get_all_patterns",
        type: "GET",
        dataType: 'json',
        success: function(patterns_array) {
            for (var index in patterns_array) {
                var htmlContent = '<option value="' + patterns_array[index] + '">' + patterns_array[index] + '</option>';
                $("#pattern").append(htmlContent);
            }
        }
    });
}

function refresh_stocks_results() {
    activateLoader();
    $("#refresh_stocks_results").attr("disabled", true);
    $.ajax({
        url: DOMAIN + "algotrading/refresh_pattern_results",
        type: "GET",
        success: function(response) {
            deactivateLoader();
        }
    });
}

function fetch_profit_lost_data() {
    var ticker = encodeURI($("#ticker").val());
    var pattern = encodeURI($("#pattern").val());

    activateLoader();

    $.ajax({
        type: "GET",
        url: DOMAIN + "algotrading/fetch_profit_lost_data/" + ticker + "/" + pattern + "/",
        dataType: 'json',
        success: function(response) {
            $("#ticker-name").html($("#ticker").val());
            $("#pattern-name").html($("#pattern").val());
            console.log(response)
            destroyDataTable();

            for (var index in response) {
                var rowClass = "neutral-class";
                rowClass = response[index]['Trend'] == "Bullish" ? "profit-class" : rowClass
                rowClass = response[index]['Trend'] == "Bearish" ? "loss-class" : rowClass

                var htmlContent = '<tr class="' + rowClass + '">' +
                    '<td>' + response[index]['DATE'] + '</td>' +
                    '<td>' + response[index]['DAYS'] + '</td>' +
                    '<td>' + response[index]['P&L'] + '</td>' +
                    '<td>' + response[index]['VOLUME'] + '</td>' +
                    '<td>' + response[index]['MACD'] + '</td>' +
                    '<td>' + response[index]['MACDS'] + '</td>' +
                    '<td>' + response[index]['RSI14'] + '</td>' +
                    '</tr>';

                $("#profit-loss-table tbody").append(htmlContent);
            }

            initiateDataTable();

            deactivateLoader();
        }
    });
}

function initiateDataTable() {
    $("#profit-loss-table").DataTable({
        destroy: true,
        searching: false,
        info: false,
        "order": [],
        "dom": '<"top"f>rt<"bottom"lp><"clear">'
    });
}

function destroyDataTable() {
    $("#profit-loss-table").DataTable().destroy();
    $("#profit-loss-table tbody").html("");
}

function activateLoader() {
    $(".container").css("opacity", "0.1");
    $(".spinner-border").show();
}

function deactivateLoader() {
    $(".container").css("opacity", "1");
    $(".spinner-border").hide();
}
