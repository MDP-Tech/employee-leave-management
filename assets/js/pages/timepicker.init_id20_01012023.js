$("#timepicker").timepicker({
    showMeridian: false, // Use 24-hour format
    placement: 'top', // Display the picker above the input field
    minuteStep: 1 // Optional setting for minute step
    // Add any additional options or callbacks here if needed

})
   
    $("#timepicker2").timepicker({
        showSeconds:!0,
        showMeridian:!1,
        icons:{up:"ri-arrow-up-s-line",down:"ri-arrow-down-s-line"},
        appendWidgetTo:"#timepicker-input-group2",
        defaultTime: '09:00:00', 
        minTime: '09:00:00',    
        maxTime: '18:00:00' 
       
    }).on('change',function(e){
        var selectedTime=e;
        console.log(selectedTime.timeStamp);
    })
        
        ,$("#timepicker3").timepicker({showSeconds:!0,minuteStep:15,icons:{up:"ri-arrow-up-s-line",down:"ri-arrow-down-s-line"},appendWidgetTo:"#timepicker-input-group3"}),$("#basic-datepicker").flatpickr(),$("#datetime-datepicker").flatpickr({enableTime:!0,dateFormat:"Y-m-d H:i"}),$("#humanfd-datepicker").flatpickr({altInput:!0,altFormat:"F j, Y",dateFormat:"Y-m-d"}),$("#minmax-datepicker").flatpickr({minDate:"2020-01",maxDate:"2020-03"}),$("#disable-datepicker").flatpickr({onReady:function(){this.jumpToDate("2025-01")},disable:["2025-01-10","2025-01-21","2025-01-30",new Date(2025,4,9)],dateFormat:"Y-m-d"}),$("#multiple-datepicker").flatpickr({mode:"multiple",dateFormat:"Y-m-d"}),$("#conjunction-datepicker").flatpickr({mode:"multiple",dateFormat:"Y-m-d",conjunction:" :: "}),$("#range-datepicker").flatpickr({mode:"range"}),$("#inline-datepicker").flatpickr({inline:!0}),$("#basic-timepicker").flatpickr({enableTime:!0,noCalendar:!0,dateFormat:"H:i"}),
        $("#24hours-timepicker").flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minTime: "09:00",
            maxTime: "17:00",
            onChange: function(selectedDates, dateStr, instance) {
                const timeInput = instance.input.value.split(":");
                const selectedHour = parseInt(timeInput[0], 10);
                const selectedMinute = parseInt(timeInput[1], 10);
        
                let updatedHour = selectedHour;
                let updatedMinute = selectedMinute;
        
                // Check if the selected time is between 12:45 and 13:45
                if ((selectedHour === 12 && selectedMinute >= 45) || (selectedHour === 13 && selectedMinute < 45)) {
                    updatedHour = (selectedHour + 1) % 24; // Increment by 2 hours to skip the disabled range
                } else {
                    updatedHour = (selectedHour + 1) % 24; // Increment by 1 hour
                }
        
                if (updatedHour < 10) {
                    updatedHour = "0" + updatedHour; // Add leading zero for single digit hours
                }
        
                const formattedTime = updatedHour + ":" + (updatedMinute < 10 ? "0" : "") + updatedMinute;
                $('#validationCustom02').val(formattedTime);
            }
        })
        
        
        
        ,$("#minmax-timepicker").flatpickr({enableTime:!0,noCalendar:!0,dateFormat:"H:i",minDate:"16:00",maxDate:"22:30"}),$("#preloading-timepicker").flatpickr({enableTime:!0,noCalendar:!0,dateFormat:"H:i",defaultDate:"01:45"});