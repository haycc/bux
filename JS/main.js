document.addEventListener("DOMContentLoaded", function () {
    var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

    if ("IntersectionObserver" in window) {
        let lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    lazyBackgroundObserver.unobserve(entry.target);
                }
            });
        });

        lazyBackgrounds.forEach(function (lazyBackground) {
            lazyBackgroundObserver.observe(lazyBackground);
        });
    }
});

$(document).ready(function () {
    var counters = document.querySelectorAll('.number-stat');
    const speed = 100; // The lower the slower

    counters.forEach(counter => {
        var updateCount = () => {
            var target = +counter.getAttribute('data-target');
            var count = +counter.textContent;

            var inc = target / speed;

            if (count < target) {
                counter.textContent = Math.round(count + inc);
                // Call function every ms
                setTimeout(updateCount, 1);
            } else {
                counter.textContent = target;
            }
        };

        updateCount();
    });

});

var robloxUsername, rEmail, robloxUserId;

function confirmFormInput(formE) {
    formE.getElementsByClassName('rbxu-i')[0].setAttribute("value", robloxUsername);
    formE.getElementsByClassName('rbxid-i')[0].setAttribute("value", robloxUserId);
    formE.getElementsByClassName('email-i')[0].setAttribute("value", rEmail);
}

function updateProfileIcon(response) {
    var img = document.getElementsByClassName("rbxProfileIcon")[0];
    document.getElementsByClassName('spinner-border')[0].setAttribute("hidden", "");
    robloxUserId = response;

    if (robloxUserId.length > 1) {
        confirmFormInput(document.querySelector("#confirmModal form"));
        httpGetAsync("https://easyrobux.cc/api/userExist.php?rbxusername=" + robloxUsername, userAlreadyExist);
        img.removeAttribute("hidden");
        img.setAttribute("src", "https://www.roblox.com/headshot-thumbnail/image?userId=" + robloxUserId + "&width=420&height=420&format=png");

    } else {
        img.removeAttribute("hidden");
        img.setAttribute("src", "img/defaulticon.png");
    }

    httpGetAsync("https://easyrobux.cc/api/userExist.php?rbxusername=" + robloxUsername, userAlreadyExist);


}

function userAlreadyExist(response) {
    var submitBtn = document.getElementsByClassName("loginbtn")[0];
    var bool = response;

    if (bool == "1") {
        $('#confirmModal').modal('hide');
        submitBtn.click();
    } else if (bool == "0") {
        return;
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 4000;
    xmlHttp.ontimeout = function () {
        callback("");
        clearTimeout(spinnerReveal);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        clearTimeout(spinnerReveal);
    }
    xmlHttp.onerror = function () {
        callback("");
        clearTimeout(spinnerReveal);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous     
    xmlHttp.send(null);

    var spinnerReveal = setTimeout(function () {
        $('.spinner-border').removeAttr("hidden");
    }, 500);
}

function ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}

function linkButton() {
    $('#confirmModal').modal('hide');
    var form = document.forms["linkForm"];
    var rbxUser = form["rbxuser"];
    var email = form["email"];
    var rbxId = form["rbxid"];

    function invalidAnim(element) {
        element.classList.add('is-invalid');
        setTimeout(function () {
            element.classList.remove("is-invalid");
        }, 1800);
    }

    var valid = true;

    if (rbxUser.value.length < 2 || rbxUser.value.length > 29) {
        valid = false;
        invalidAnim(rbxUser);
    }

    if (!ValidateEmail(email.value) && email.value != "") {
        invalidAnim(email);
        return;
    }

    if (valid) {
        $('#myModal').modal('hide');
        $('#confirmModal').modal('show');
        $('#confirmModal').find('h5.rbxUserConfirm').html(rbxUser.value);
        $('.rbxProfileIcon').attr("hidden", "");

        //pass form values
        robloxUsername = rbxUser.value;
        rEmail = email.value;

        confirmFormInput(document.querySelector("#confirmModal form"));

        httpGetAsync("https://easyrobux.cc/api/getRbxId.php?rbxusername=" + rbxUser.value, updateProfileIcon);


    }
    return false;
}

function confirmButton() {

}
