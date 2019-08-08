$(function(){    
    //limit input of id=itemAmount
    $("#itemAmount").keyup(function(e) {
        // Our regex
        // a-z => allow all lowercase alphabets
        // A-Z => allow all uppercase alphabets
        // 0-9 => allow all numbers
        // @ => allow @ symbol
        var regex = /^[0-9.]+$/;
        // This is will test the value against the regex
        // Will return True if regex satisfied
        if (regex.test(this.value) !== true)
            //alert if not true
            //alert("Invalid Input");
            // You can replace the invalid characters by:
            this.value = this.value.replace(/[^0-9.]+/, '');
    });
});