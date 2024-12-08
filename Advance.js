Papa.parse("stock_data_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const yarray = [];
        const customdata = [];

        results.data.forEach(row => {
            xarray.push(row['Date']);
            yarray.push(parseFloat(row['Close']));
            customdata.push({
                Open: parseFloat(row['Open']).toFixed(2),
                High: parseFloat(row['High']).toFixed(2),
                Low: parseFloat(row['Low']).toFixed(2),
                Volume: parseInt(row['Volume']),
            })
        });

        //DATA ONLOAD

        const tarce1 = [{
            x: xarray,
            y: [],
            customdata: customdata,
            mode: "lines",
            type: "scatter",
            fill: "tozeroy",
            fillgradient: {
                type: 'vertical',
                colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
            },
            line: {
                width: 2
            },
            hovertemplate:
                'Date: %{x}<br>' +
                'Close: %{y}<br>' +
                `Open: %{customdata.Open}<br>` +
                `High: %{customdata.High}<br>` +
                `Low: %{customdata.Low}<br>` +
                `Volume: %{customdata.Volume}<br>` +
                '<extra></extra>',
        }];

        //LAYOUT ONLOAD


        const layout = {
            xaxis: {
                range: [xarray[0], xarray[xarray.length - 1]], title: {
                    text: "Date",
                    font: {
                        color: "white"
                    }
                },
                tickfont: {
                    color: "white"
                }
            },
            yaxis: {
                range: [0, Math.max(...yarray) + 20], title: {
                    text: "Prices",
                    font: {
                        color: "white"
                    }
                },
                tickfont: {
                    color: "white"
                }
            },
            colorway: ['#7834a8'],
            plot_bgcolor: "black",
            paper_bgcolor: "black",
        };

        //PLOTLING THE GRAPH AND ANIMATING IT WITH REQUEST ANIMATION FRAME


        Plotly.newPlot("myplot", tarce1, layout);
        let i = 0; let id;
        function animate() {
            if (i < xarray.length) {
                Plotly.extendTraces("myplot", {
                    x: [[xarray[i]]],
                    y: [[yarray[i]]]
                }, [0])
                i++;
                id = requestAnimationFrame(animate);
            }
        }
        animate();

        const stp = document.getElementById("stp");
        stp.addEventListener("click", func);
        function func() {
            Plotly.react("myplot", [{
                x: xarray,
                y: yarray,
                customdata: customdata,
                mode: "lines",
                type: "scatter",
                fill: "tozeroy",
                fillgradient: {
                    type: 'vertical',
                    colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
                },
                line: {
                    width: 2
                },
                hovertemplate:    //HOVERING TEMPLATE
                    'Date: %{x}<br>' +
                    'Close: %{y}<br>' +
                    `Open: %{customdata.Open}<br>` +
                    `High: %{customdata.High}<br>` +
                    `Low: %{customdata.Low}<br>` +
                    `Volume: %{customdata.Volume}<br>` +
                    '<extra></extra>',
            }], layout)
            cancelAnimationFrame(id);
        }
    }
});

//ONCLICK SECOND GRAPH ADDED ON THE SCREEN


const second = document.getElementById("second")
second.addEventListener("click", fus);
let i = 2;
function fus() {
    Papa.parse("stock_data_" + `${i}` + ".csv", {
        download: true,
        header: true,
        complete: function (results) {
            const xa = [];
            const ya = [];
            const customdata = [];

            results.data.forEach(row => {
                xa.push(row['Date']);
                ya.push(parseFloat(row['Close']));
                customdata.push({
                    Open: parseFloat(row['Open']).toFixed(2),
                    High: parseFloat(row['High']).toFixed(2),
                    Low: parseFloat(row['Low']).toFixed(2),
                    Volume: parseInt(row['Volume']),
                })
            });

            const tarce2 = [{
                x: xa,
                y: ya,
                customdata: customdata,
                mode: "lines",
                type: "scatter",
                line: {
                    width: 2
                },
                hovertemplate:
                    'Date: %{x}<br>' +
                    'Close: %{y}<br>' +
                    `Open: %{customdata.Open}<br>` +
                    `High: %{customdata.High}<br>` +
                    `Low: %{customdata.Low}<br>` +
                    `Volume: %{customdata.Volume}<br>` +
                    '<extra></extra>',
            }];

            Plotly.addTraces("myplot", tarce2);
            i++;
        }

    });

}

//BOILENGER BAND GRAPH
Papa.parse("stock_data_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const yarray = [];

        results.data.forEach(row => {
            xarray.push(row['Date']);
            yarray.push(parseFloat(row['Close']));
        });
        function calculate(yarray, period = 20, multiplier = 2) {
            const upper = [];
            const lower = [];
            const middle = [];
            for (let i = 0; i < yarray.length; i++) {
                if (i >= period - 1) {
                    const slice = yarray.slice(i - period + 1, i + 1);
                    const mean = slice.reduce((a, b) => a + b, 0) / period;
                    const sd = Math.sqrt(slice.map(val => Math.pow(val - mean, 2)).reduce((a, b) => a + b, 0) / period)
                    upper.push(mean + multiplier * sd);
                    middle.push(mean);
                    lower.push(mean - multiplier * sd);
                }
            }
            return { middle, lower, upper };
        }
        const boilenger = document.getElementById("boilenger");
        boilenger.addEventListener('click', () => {
            const { upper, lower, middle } = calculate(yarray);
            Plotly.addTraces("myplot", {
                x: xarray,
                y: upper,
                mode: "lines",
                type: "scatter",
                line: {
                    width: 3,
                    color: "blue"
                }
            })
            Plotly.addTraces("myplot", {
                x: xarray,
                y: lower,
                mode: "lines",
                type: "scatter",
                line: {
                    width: 3,
                    color: "blue"
                }
            })
            Plotly.addTraces("myplot", {
                x: xarray,
                y: middle,
                mode: "lines",
                type: "scatter",
                line: {
                    width: 3,
                    color: "blue"
                }
            })
        })
    }
})

//RSI MARK
// --------------------------------------------------------------------------------------------------------------------------------------
Papa.parse("stock_data_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const yarray = [];
        const customdata = [];

        results.data.forEach(row => {
            xarray.push(row['Date']);
            yarray.push(parseFloat(row['Close']));

        });
        function changes(yarray, period = 14) {
            let gain = [];
            let losses = [];
            for (let i = 1; i < yarray.length; i++) {
                let change = yarray[i] - yarray[i - 1];
                if (change > 0) {
                    gain.push(change);
                    losses.push(0);
                }
                else {
                    gain.push(0);
                    losses.push(Math.abs(change));
                }
            }
            let rsi = [];
            for (let i = period; i < yarray.length; i++) {
                const avggain = gain.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
                const avgloss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

                let rs = avggain / avgloss;
                rsi.push(100 - (100 / (1 + rs)));
            }
            rsi = new Array(period).fill(null).concat(rsi);
            return rsi;
        }
        const rsii = document.getElementById("rsi");
        rsii.addEventListener('click', () => {
            const value = changes(yarray);

            const rsilayout = {
                xaxis: {
                    range: [xarray[0], xarray[xarray.length - 1]], title: {
                        text: "Date",
                        font: {
                            color: "white"
                        }
                    },
                    tickfont: {
                        color: "white"
                    }
                },
                yaxis: {
                    range: [0, 100], title: {
                        text: "Prices",
                        font: {
                            color: "white"
                        }
                    },
                    tickfont: {
                        color: "white"
                    }
                },
                colorway: ['#7834a8'],
                plot_bgcolor: "black",
                paper_bgcolor: "black",
            };
            const rsitrace = [{
                x: xarray,
                y: value,
                customdata: customdata,
                mode: "lines",
                type: "scatter",
                line: {
                    width: 2
                }
            }];
            Plotly.newPlot("rsigraph", rsitrace, rsilayout,)
            const ys = new Array(xarray.length).fill(70)
            const ysi = new Array(xarray.length).fill(30)
            Plotly.addTraces("rsigraph", {
                x: xarray,
                y: ys,
                mode: "lines",
                type: "scatter",
                name: "overbought (70)",
                line: {
                    color: "red",
                    width: 2
                }
            })
            Plotly.addTraces("rsigraph", {
                x: xarray,
                y: ysi,
                mode: "lines",
                type: "scatter",
                name: "oversold (30)",
                line: {
                    color: "red",
                    width: 2
                }
            })

        })
    }
})




//MACD MARK
const macd = document.getElementById('macd');
macd.addEventListener('click', () => {
    Papa.parse("technical_indicators_1.csv", {
        download: true,
        header: true,
        complete: function (results) {
            const xarray = [];
            const MACD = [];
            const MACDsignal = [];
            const MACDhistogramabove = new Array(results.data.length).fill(null);
            const MACDhistogrambelow = new Array(results.data.length).fill(null);

            results.data.forEach((row, index) => {
                xarray.push(row['Date'])
                MACD.push(row['MACD']);
                MACDsignal.push(row['MACD_signal']);
                const histo_value = row['MACD_histogram'];
                if (histo_value > 0) {
                    MACDhistogramabove[index] = (histo_value);
                }
                else {
                    MACDhistogrambelow[index] = (histo_value);
                }
            });
            Plotly.addTraces("myplot", {
                x: xarray,
                y: MACD,
                mode: "lines",
                type: "scatter",
                name: "MACD",
                line: {
                    width: 2,
                    color: "yellow"
                }
            })
            Plotly.addTraces("myplot", {
                x: xarray,
                y: MACDsignal,
                mode: "lines",
                type: "scatter",
                name: "MACDsignals",
                line: {
                    width: 2,
                    color: "blue"
                }
            })
            Plotly.addTraces("myplot", {
                x: xarray,
                y: MACDhistogramabove,
                type: "bar",
                name: "MACDhistogramabove",
                marker: {
                    color: "green"
                }
            })
            Plotly.addTraces("myplot", {
                x: xarray,
                y: MACDhistogrambelow,
                type: "bar",
                name: "MACDhistogrambelow",
                marker: {
                    color: "red"
                }
            })
        }
    })
})

document.addEventListener('DOMContentLoaded', function() {
    const dateRangeBtn = document.getElementById('date-range-btn');
    const calendarPopup = document.getElementById('calendar-popup');
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({length: currentYear - 1979}, (_, i) => 1980 + i);
  
    function initializeCalendar(calendar) {
      const monthSelect = calendar.querySelector('.month-select');
      const yearSelect = calendar.querySelector('.year-select');
      
      months.forEach((month, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = month;
        monthSelect.appendChild(option);
      });
  
      yearRange.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }
  
    initializeCalendar(document.querySelector('.from-calendar'));
    initializeCalendar(document.querySelector('.to-calendar'));
  
    dateRangeBtn.addEventListener('click', () => {
      calendarPopup.style.display = calendarPopup.style.display === 'none' ? 'block' : 'none';
    });
  
    document.querySelector('.apply-btn').addEventListener('click', () => {
      const fromMonth = document.querySelector('.from-calendar .month-select').value;
      const fromYear = document.querySelector('.from-calendar .year-select').value;
      const fromDay = document.querySelector('.from-calendar .calendar-body .selected')?.textContent;
      
      const toMonth = document.querySelector('.to-calendar .month-select').value;
      const toYear = document.querySelector('.to-calendar .year-select').value;
      const toDay = document.querySelector('.to-calendar .calendar-body .selected')?.textContent;
      
      if (fromDay && toDay) {
          const fromDate = new Date(fromYear, fromMonth, fromDay);
          const toDate = new Date(toYear, toMonth, toDay);
          
          if (fromDate <= toDate) {
              dateRangeBtn.textContent = `${fromDay}/${Number(fromMonth) + 1}/${fromYear} - ${toDay}/${Number(toMonth) + 1}/${toYear}`;
              calendarPopup.style.display = 'none';
              
              updateGraph(fromDate, toDate);
          }
      }
  });
  
    document.querySelector('.cancel-btn').addEventListener('click', () => {
      calendarPopup.style.display = 'none';
    });
  });
  
  document.querySelector('.apply-btn').addEventListener('click', () => {
    const fromMonth = document.querySelector('.from-calendar .month-select').value;
    const fromYear = document.querySelector('.from-calendar .year-select').value;
    const fromDay = document.querySelector('.from-calendar .calendar-body .selected')?.textContent;
    
    const toMonth = document.querySelector('.to-calendar .month-select').value;
    const toYear = document.querySelector('.to-calendar .year-select').value;
    const toDay = document.querySelector('.to-calendar .calendar-body .selected')?.textContent;
    
    if (fromDay && toDay) {
        const fromDate = new Date(fromYear, fromMonth, fromDay);
        const toDate = new Date(toYear, toMonth, toDay);
        
        if (fromDate <= toDate) {
            dateRangeBtn.textContent = `${fromDay}/${Number(fromMonth) + 1}/${fromYear} - ${toDay}/${Number(toMonth) + 1}/${toYear}`;
            calendarPopup.style.display = 'none';
            
            updateGraph(fromDate, toDate);
        }
    }
  });
  
  function updateCalendarBody(calendar, month, year) {
    const calendarBody = calendar.querySelector('.calendar-body');
    calendarBody.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('button');
        emptyCell.disabled = true;
        calendarBody.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement('button');
        dayButton.textContent = day;
        
        const currentDate = new Date(year, month, day);
        if (currentDate > today) {
            dayButton.disabled = true;
            dayButton.style.opacity = "0.3";
        } else {
            dayButton.addEventListener('click', (e) => {
                calendar.querySelectorAll('.calendar-body button').forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        }
        
        calendarBody.appendChild(dayButton);
    }
  }
  
  
  document.querySelectorAll('.month-select, .year-select').forEach(select => {
    select.addEventListener('change', (e) => {
        const calendar = e.target.closest('.from-calendar, .to-calendar');
        const month = calendar.querySelector('.month-select').value;
        const year = calendar.querySelector('.year-select').value;
        updateCalendarBody(calendar, parseInt(month), parseInt(year));
    });
  });
  
  const now = new Date();
  document.querySelectorAll('.from-calendar, .to-calendar').forEach(calendar => {
    calendar.querySelector('.month-select').value = now.getMonth();
    calendar.querySelector('.year-select').value = now.getFullYear();
    updateCalendarBody(calendar, now.getMonth(), now.getFullYear());
  });

  
  document.getElementById('rsi').addEventListener('click',(e) => {
    const graphUrl = 'rsigraph'; 
    window.open(graphUrl, '_blank');
    })

    /*dropdown menu*/

    const addButton = document.getElementById("addButton");
    const dropdownMenu = document.getElementById("dropdownMenu")

    addButton.addEventListener('click' , () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    })

    document.addEventListener('click', (event) => {
        if (!addButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
