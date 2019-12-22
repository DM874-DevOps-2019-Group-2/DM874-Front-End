(function(window, undefined) {

const el = {};

window.set_page_style = function(stylesheet_url) {
	el.page_css.href = stylesheet_url;
}

function run_scripts() {
	el.page_scripts.innerHTML = '';

	const scripts = el.main_view.getElementsByTagName('script');
	for (s of scripts) {
		let new_script = document.createElement('script');
		new_script.innerText = s.innerText;
		el.page_scripts.appendChild(new_script);
	}
}

function navigate_to_page(page) {
	page_contents_file = 'pages/'+page+'.html';
	address = '?page=' + page;

	(async function() {
		let res = await fetch(page_contents_file);
		if (res.status < 200 || res.status >= 300) {
			res = await fetch('pages/404.html');
		}
		const contents = await res.text();
		el.main_view.innerHTML = contents;
		window.set_page_style("");
		run_scripts();

		window.history.replaceState('ja', 'Title', address);
	})()
}

document.addEventListener('DOMContentLoaded', function(){
	el.main_nav = document.getElementById('main_navigation');
	el.main_view = document.getElementById('main_view');
	el.page_css = document.getElementById('page_css');
	el.page_scripts = document.getElementById('page_script');

	const nav_buttons = el.main_nav.querySelectorAll('.nav_button')

	for (b of nav_buttons){
		b.addEventListener('click', function(event) {
			event.preventDefault();
			const button = event.target;
			const page = button.dataset.nav;
			navigate_to_page(page);
		}, false)
	}

	const params = (new URL(document.location)).searchParams;
	const page = params.get("page") || 'home';

	navigate_to_page(page)
})

}).call(window, window)