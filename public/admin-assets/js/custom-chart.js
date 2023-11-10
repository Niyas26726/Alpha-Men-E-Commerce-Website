(function ($) {
    let myLineChart
    // console.log('months:', months);
    "use strict";
    function sendDataToServer(data) {
    console.log('data:', data);

    $.ajax({
        url: `/admin/home`,
        method: 'GET', // Adjust the method based on your API requirement
        data: { type: data },
        success: function (data) {
            const orderCount = data.orderCount; // Assuming data is an array of months
            // Your chart creation logic using the months data
            // Example:
            console.log('Months data:', Object.keys(orderCount));
            console.log('orderCount:', orderCount);
            // Rest of your chart creation code

    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        var ctx = document.getElementById('myChart').getContext('2d');
        myLineChart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: Object.keys(orderCount),
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: Object.values(orderCount)
                    },
                    // {
                    //     label: 'Visitors',
                    //     tension: 0.3,
                    //     fill: true,
                    //     backgroundColor: 'rgba(4, 209, 130, 0.2)',
                    //     borderColor: 'rgb(4, 209, 130)',
                    //     data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
                    // },
                    // {
                    //     label: 'Products',
                    //     tension: 0.3,
                    //     fill: true,
                    //     backgroundColor: 'rgba(380, 200, 230, 0.2)',
                    //     borderColor: 'rgb(380, 200, 230)',
                    //     data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
                    // }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                }
            }
        });
        
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        var ctx = document.getElementById("myChart2");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: ["900", "1200", "1400", "1600"],
            datasets: [
                {
                    label: "US",
                    backgroundColor: "#5897fb",
                    barThickness:10,
                    data: [233,321,783,900]
                }, 
                {
                    label: "Europe",
                    backgroundColor: "#7bcf86",
                    barThickness:10,
                    data: [408,547,675,734]
                },
                {
                    label: "Asian",
                    backgroundColor: "#ff9076",
                    barThickness:10,
                    data: [208,447,575,634]
                },
                {
                    label: "Africa",
                    backgroundColor: "#d595e5",
                    barThickness:10,
                    data: [123,345,122,302]
                },
            ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } //end if
},
error: function (error) {
    console.error('Error fetching months data:', error);
}
});
    }

// Event listeners for button clicks
$(document).ready(function() {
    $('#dailyBtn').click(function() {
        myLineChart.destroy();

        sendDataToServer('daily');
    });

    $('#weeklyBtn').click(function() {
        myLineChart.destroy();
        sendDataToServer('weekly');
    });

    $('#monthlyBtn').click(function() {
        myLineChart.destroy();
        sendDataToServer('monthly');
    });

    $('#yearlyBtn').click(function() {
        myLineChart.destroy();
        sendDataToServer('yearly');
    });
});
$(document).ready(function() {
    sendDataToServer('monthly');
});
})(jQuery);
