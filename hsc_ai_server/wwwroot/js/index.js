const timer = ms => new Promise(res => setTimeout(res, ms))
    var motds = [
        "Your Education, Your Story: Transforming Frustration into Success",
        "Championing Individuality: AI Education that Listens and Evolves",
        "Escape the Limitations of Traditional Education with AI",
        "Learning Revolutionized: Because Education Shouldn't Fail You"
    ];

    /*
        Init()
        Initialize client side
    */
    async function init(){
        $("#motd").animate({ opacity: 1 }, 1000);

        // Fade in
        $("#logo").animate({ opacity: 1 }, 1000);
        
        $("#btn_login").animate({ opacity: 1 }, 1000);
        $("#btn_register").animate({ opacity: 1 }, 1000);


        // Menu panel sequential fade
        var menuBtns = document.getElementsByClassName('menu-panel-button');
        for(let i = 0; i < menuBtns.length; i++){
            var time = (500 + i * 100);
            $(menuBtns[i]).animate({ opacity: 1 }, time);
        }

        try{
            var username = localStorage.getItem('user');
            if(username != null){
                document.getElementById('btn_login').innerText = username;
                document.getElementById('btn_register').style.visibility = "hidden";
            }
        }
        catch{}

        while(true){
            if(isInViewport(document.querySelector('.subject-container'))){
                var subjects = document.getElementsByClassName('subject');
                for(let i = 0; i < subjects.length; i++){
                    var time = (i * 30);
                    await timer(time);
                    subjects[i].style.opacity = 1;
                }
            }
            await timer(500);
        }
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    

    /*
        MotdScroll()
        message of the day handler
    */
    async function motdScroll(){
        while(true){
            for(let i = 0; i < motds.length; i++){
                $("#motd").animate({ opacity: 1 }, 1000);
                document.getElementById("motd").innerText = motds[i];
                await timer(5000);
                $("#motd").animate({ opacity: 0 }, 1000);
                await timer(2000);
            }
        }
    }

    /*
        Redirect()
        Href for non <a> elements
    */
    function Redirect(path){
        window.location.href = path;
    }

    /*
        RGBCycle()
        Cycle rgb
    */
    async function RGBCycle(){
        let elementID = [];
        var colors = ['red', 'green', 'blue'];
        for(let i = 0; i < elementID.length; i++){
            var element = document.getElementById(elementID[i]);
            element.style.transitionDuration = 1000;
            for(let j = 0; j < color.length; j++){
                element.style.backgroundColor = colors[j];
                await timer(1000);
            }
        }
    }

    /*
        SubjectClicked()
        Save selected subject name to local storage for interface page
    */
    function SubjectClicked(subjectName){
        if(localStorage.getItem('user') != null){
            const json = { subject : subjectName };
            localStorage.setItem("precached_subject", JSON.stringify(json));
            window.location.href = "/pages/interface.html";
        }
        else{
            Redirect("../pages/log.html");
        }
    }