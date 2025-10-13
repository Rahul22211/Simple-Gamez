fetch("https://restcountries.com/v3.1/all?fields=name,flags")
    .then(response => response.json())
    .then(data =>{
        const dropdown = document.getElementById('dropdown');
        console.log(data);
        data.forEach(item => {
            const option = document.createElement("option")
            option.text = item.name.official;
            option.value = item.name.official;
            dropdown.appendChild(option);
        });
        let img = new Image();
        function updateFlag(){
            let selected = dropdown.value;
            let num = 0;
            for(let i = 0; i < data.length; i++){
                if(data[i].name.official === selected){
                    num = i;
                    console.log(i);
                }
            }
            console.log(num);
            img.src = data[num].flags.png
            $("#flag").fadeOut(1000, function() {
                document.getElementById('flag').innerHTML =`<img src = "${img.src}" alt = "Flag">`
                $("#flag").fadeIn(1000)
            });
        }
        updateFlag();
        dropdown.addEventListener("change", updateFlag);
    })
    .catch(error => console.error("Error fetching JSON: ", error))  