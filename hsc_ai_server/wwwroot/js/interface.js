    const timer = ms => new Promise(res => setTimeout(res, ms))
    var writingState = false;
    const subject_enum = {
        MATH: 0,
        PHYSICS: 1,
        BIOLOGY: 2,
        CHEMISTRY: 3,
        ENGINEERING: 4,
        SOFTWARE: 5,
        BUSINESS: 6,
        ECONOMICS: 7,
        ENGLISH: 8
    };

    /*
        Init()
        Initialize client side
    */
    async function Init(){
        const precahed = JSON.parse(localStorage.getItem('precached_subject'));
        const subjectName = precahed.subject;

        const request = await fetch("/subject", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: subjectName
        });

        var response = await request.json();
        var responseJson = JSON.parse(response);
        var lastIndex = 0;

        // Load modules in side-panel
        const modules        = Object.keys(responseJson.modules);
        const modIndexes     = Object.values(responseJson.modules);
        const topics         = Object.keys(responseJson.topics);
        const topicsDataPath = Object.values(responseJson.topics);

        var allTopics = [];

        for(let i = 0; i < modules.length; i++){ // Foreach module
            // Instantiate a module on side panel
            var moduleObj = document.createElement("div");
            var topicContainer = document.createElement("div");

            topicContainer.className = "module-topic-container";

            moduleObj.className = "side-panel-node";
            moduleObj.innerText = modules[i];
            for(let j = lastIndex; j < modIndexes[i]; j++, lastIndex++){ // Add respective topics
                var topic = document.createElement("a");

                topic.className = "module-topic"; // Set topic data
                topic.innerText = topics[j];
                topic.setAttribute("package", topicsDataPath[j]); // Send as id
                allTopics[allTopics.length] = topic;
                
                topicContainer.appendChild(topic);
            }

            // Add topic eventhandlers
            for(let c = 0; c < allTopics.length; c++){
                allTopics[c].addEventListener('click', TopicEvent(allTopics[c]));
            }

            moduleObj.appendChild(topicContainer); // Add topic data to module
            document.getElementById("side_panel").appendChild(moduleObj); // Add object to page
        }

        var str = null;
        var introductionLines = [
            "How about we sneak into the world of knowledge for an hour? I'll be the fun guide, and you can be the expert explorer.",
        "Ready to conquer the realm of learning for the next hour? I'll bring the enthusiasm, and you bring the curiosity!",
        "Picture this: an hour of brain aerobics with a side of laughter. Ready to dive in and flex those mental muscles?",
        "Shall we turn our study session into a grand adventure? I promise to sprinkle in fun facts and high-fives for every achievement!",
        "Let's make studying as cool as a secret mission! I've got the codes to unlock knowledge, and you've got the determination.",
        "Imagine an hour of study as a magical quest, and I'm the wizard here to make the journey enchanting. Are you up for it?",
        "Ready to jazz up our brains with a delightful hour of learning? I'll be the DJ of academic excellence, and you can dance through the material!",
        "How about we turn our study hour into a game of wits and wisdom? I'll bring the challenges, and you bring the brilliance!",
        "Grab your metaphorical explorer hat – we're about to venture into the realm of knowledge! I promise to make every discovery feel like treasure.",
        "Shall we rock this study session like a dynamic duo? I'll be your academic partner-in-crime, making sure each moment is a blast!"   
        ];

        let rndIndex = Math.floor(Math.random() * 10);
        if(localStorage.getItem('user') != null){
            str = "Hey " + localStorage.getItem('user') + "! " + introductionLines[rndIndex];
        }

        TypewriterEffect(str);
    }

    /*
        SendQuery()
        Send POST request to server
    */
    async function SendQuery(){
        var query = document.getElementById("chatboxinput");
        var chatbox = document.getElementById("chatbox");
        const request = await fetch("/ai/" + "chat", {
            method: "POST",
            headers:{
                "Content-Type": "text/plain"
            },
            body: query.value
        });

        console.log("request sent: " + query.value);
        query.value = "";

        var response = await request.text();
        if(writingState == false){
            TypewriterEffect(response);
        }
    }

    /*
        TopicEvent()
        When topic clicked
    */
    async function TopicEvent(element){
        const request = await fetch("/ai/" + element.getAttribute("package"), {
            method: "POST",
            headers:{
                "Content-Type": "text/plain"
            },
            body: "Alright, lets start on the topic you were just given"
        });

        var response = await request.text();
        if(writingState == false){
            TypewriterEffect(response);
        }
    }

    /*
        AnimateProgressBar()
        Progress bar underglow
    */
    async function AnimateProgressBar(){
        var spine = document.getElementById("sidepanel_spine");
        while(true){
            spine.style["boxShadow"] = "0 0 10px green";
            await timer(1000);
            spine.style["boxShadow"] = "0 0 0px green";
            await timer(1000);
        }
    }

    /*
        SetProgressBar()
        Set progress bar completion
        Causing Errors for some reason!
    */
    async function SetProgressBar(){
        var progressBar = document.getElementById('sidepanel_spine');
        const request = await fetch("/getuser", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: localStorage.getItem('user')
        });
        
        var response = await request.json();
        var deserialised = JSON.parse(response);
        var currentSubject = localStorage.getItem('precached_subject');
        var progPercentage = (100 - deserialised.subjectProgress[currentSubject]);

        progressBar.style.background = "linear-gradient(0, #1b1b1e " + progPercentage + "%, lightgreen 0%";
    }

    /*
        TypewriterEffect()
        Do ai print effect
    */
    async function TypewriterEffect(str){
        var chatbox = document.getElementById("chatbox");
        writingState = true;
        chatbox.value += "\n\n";
        for(let i = 0; i < String(str).length; i++){
            chatbox.value += str[i];
            await timer(25);
        }
        writingState = false;
    }