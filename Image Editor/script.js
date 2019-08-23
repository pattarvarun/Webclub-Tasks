document.addEventListener('DOMContentLoaded',function(){

    //Handling Image Input

    
    var loadImage = document.getElementById('load');

    function loadInput(event){
        var ImageFile = event.target.files[0];
        var ImageElement = document.getElementById('image');
        ImageElement.setAttribute('src',URL.createObjectURL(ImageFile));

    };
    loadImage.onchange = loadInput;

    //Apply Slider Effect on Image

    function changeSliderHandler(event){
        Caman("#image",function renderCaman(){
            // this.revert(false);
            this[event.target.name](event.target.value).render();
        });
    };

    //Handling changes in values
    var ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach(function(range){
        range.onchange = changeSliderHandler;
    });

    var resetButton = document.getElementById("reset");


    //Reset Button Handler
    function resetButtonHandler(event){
        ranges.forEach(function(range){
            range.value = 0;
        });
        Caman("#image",function(){
            this.revert(true);
        });
    };
    resetButton.onclick = resetButtonHandler;


    //Save edited image
    var saveButton = document.getElementById('save');
    function saveButtonHandler(event){
        Caman('#image',function(){
            this.render(function(){
                // this.save('EditedImage.png');
                var image = this.toBase64();
                this.save('png');
            });
        });
    };

    saveButton.onclick = saveButtonHandler;

});