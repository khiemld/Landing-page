const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


/** Toggle comment */ 
const commentButtons = $$('.comment-button');

commentButtons.forEach(commentButton => {
    commentButton.onclick = function(){

        const parentNode = this.parentElement;
        
        parentNode.classList.toggle('active');
        
    };
})



/** Tab move */
const tabs = $$(".main-select");

const tabActive = $(".main-select.active");
const line = $(".top-main .line");

requestIdleCallback(function () {
    line.style.left = tabActive.offsetLeft + "px";
});


tabs.forEach((tab, index) => {
    tab.onclick = function(){
        $(".main-select.active").classList.remove("active");
        console.log([tabActive]);
        line.style.left = this.offsetLeft - this.style.marginLeft + "px" ;
        this.classList.add("active");
    };
});

/**Side bar*/

const menuItem = $$(".menu__item");
console.log(menuItem);

