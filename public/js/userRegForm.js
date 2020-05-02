document.getElementById("teacherSection").style.display = "none";

// checking user type
document.getElementsByClassName('user_section')[0]
    .addEventListener('click', function (event) {
        if (document.getElementById('user_student').checked) {
            // console.log("STUDENT");
            document.getElementById("teacherSection").style.display = "none";
            document.getElementById("studentSection").style.display = "block";
        } else if (document.getElementById('user_teacher').checked) {
            // console.log("teACHER");
            document.getElementById("studentSection").style.display = "none";
            document.getElementById("teacherSection").style.display = "block";
        }
    });
