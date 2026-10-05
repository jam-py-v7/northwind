(function($, task) {
"use strict";

function Events1() { // northwind_traders 

	////////////////////////////////////////////////////////////////////////////////
	// Important - this is the default code a new Jam.py application is 
	// shipped with. Normally, we do not change much here, if anything. 
	// For msaccess.pythonanywhere.com application, the "Delete" code 
	// is disabled and a few links are added (about, export, portable, pass).
	// All code relevant to the application functionality is @Client or Server 
	// Module for each table.
	// The code relevant for the complete application, 
	// like the custom authentication "on_login", is in Task/Server. 
	// Also, there is the API code.
	
	// How this application was built is in the Help section:
	
	// https://jampyapplicationbuilder.com/tips/migration/examples/ledger.html
	////////////////////////////////////////////////////////////////////////////////
	
	function on_page_loaded(task) {
		$("#title").text(task.item_caption);
		$('#app-title').focus();
		
		if (task.safe_mode) {
			$("#user_info").text(task.user_info.user_name);
			$("#role_info").text(task.user_info.role_name);
			$('#log-out').show() .click(function(e) {
				e.preventDefault();
					task.logout();
			}); 
		}
	
		if (task.full_width) {
			$('#container').removeClass('container').addClass('container-fluid');
		}
		
		$('#container').show();
		
		task.create_menu($("#menu"), $("#content"), {
			// splash_screen: '<h1 class="text-center">Application</h1>',
			view_first: true
		});
		
		$("#about").click(function(e) {
			e.preventDefault();
			task.message(
				task.templates.find('.about'),
				{title: 'Jam.py framework App Version ' + task.version, margin: 0, text_center: true, 
					buttons: {"OK": undefined}, center_buttons: true}
			);
		});
		
		$("#export").click(function(e) {
			var url = [location.protocol, '//', location.host, location.pathname].join('');
				url += 'static/northwind_traders.zip';
				window.open(encodeURI(url));
				task.server('downloaded', function(error) {
					if (error) {
						task.alert_error(error);
					}
				});
		});
		
		$("#portable").click(function(e) {
			var url = [location.protocol, '//', location.host, location.pathname].join('');
				url += 'static/jampy_win_64.exe';
				window.open(encodeURI(url));
				task.server('downloaded_portable', function(error) {
					if (error) {
						task.alert_error(error);
					}
				});
	
		});
		
		$("#menu-right #darkly a").click(function(e) {
			// task.alert_success('Please refresh the page!');
			task.server('theme1', function(res) {
				if (res === 'changed') {
					task.alert_error('Please refresh the page!');
				}
				else {
					task.alert_error(error);
				}
			});
	
		});
		
		$("#menu-right #flatly a").click(function(e) {
			// task.alert_success('Please refresh the page!');
			task.server('theme2', function(res) {
				if (res === 'changed') {
					task.alert_error('Please refresh the page!');
				}
				else {
					task.alert_error(error);
				}
			});
		});
	
		$("#menu-right #pass a").click(function(e) {
			e.preventDefault();
			task.change_password.open({open_empty: true});
			task.change_password.append_record();
		});
	
		$("#pass").click(function(e) {
			e.preventDefault();
			task.change_password.open({open_empty: true});
			task.change_password.append_record();
		});
	
		// $(document).ajaxStart(function() { $("html").addClass("wait"); });
		// $(document).ajaxStop(function() { $("html").removeClass("wait"); });
	} 
	
	function on_view_form_created(item) {
		var table_options_height = item.table_options.height,
			table_container;
	
		item.clear_filters();
		
		item.paginate = false;
		item.view_options.table_container_class = 'view-table';
		item.view_options.detail_container_class = 'view-detail';
		item.view_options.open_item = true;
		
		//columns management
		//add columns start
		let add_columns_div = $(
			'<div class="form-header-add_clomuns">'+
			'   <button id="add_columns_btn" class="btn btn-secondary" type="button">'+
			'	   <i class="bi bi-sliders2-vertical"></i>'+
			'   </button>'+
			'</div>'
			);
			
		item.view_form.find('[class="card-header form-header"]').append(add_columns_div);
		
		//add columns form
		item.view_form.find('#add_columns_btn').click(function(e) {
			task.view_columns.find_form_by_id(item.ID);
			
			task.view_columns.view_options.title = 'Manage columns for table: ' + item.item_caption.bold();
			task.view_columns.paginate = false;
			task.view_columns.view();
			
			let selections_item;
				
			if (item.table_options.multiselect === true) {
				selections_item = item.selections;
				
				if (item.selections.length === 0) {
					selections_item = [];
				}
				task.view_columns.view_form.find('#seleted_rows_info').text(selections_item.length + ' rows for export selected...');
			}   else {
				 task.view_columns.view_form.find('#seleted_rows_info').text('Export is not possible. Enable multiselect for item!');
			}
			
			//set columns
			task.view_columns.view_form.find('#ok-btn').click(function(e) {
				item.view_options.fields = e.result;
				item.table_options.sortable = true;
				item.table_options.sort_fields = e.result;
				task.view_columns.close_view_form();
				item.close_view_form();
				item.view(task.task.forms_container);
			});
			
			//export to xlsx selected rows and columns
			task.view_columns.view_form.find('#export_xlsx_btn').click(function(e) {
				task.view_columns.export_table_xlsx(item.ID, e.result, selections_item);
			});
		});
		//add columns end
		
		if (item.view_form.hasClass('modal-form')) {
			item.view_options.width = 1060;
			item.table_options.height = $(window).height() - 300;
			item.view_options.close_button = true;
			item.view_form.find('#add_columns_btn').hide();
		}
		else	{
			if (!item.table_options.height) {
				item.table_options.height = $(window).height() - $('body').height() - 20;
			}
			
			item.view_options.close_button = false;
			item.view_form.find('#add_columns_btn').show();
		}
		
		if (item.can_create()) {
			item.view_form.find("#new-btn").on('click.task', function(e) {
				e.preventDefault();
				if (item.master || item.master_field) {
					item.append_record();
				}
				else {
					item.insert_record();
				}
			});
		}
		else {
			item.view_form.find("#new-btn").prop("disabled", true);
		}
	
		item.view_form.find("#edit-btn").on('click.task', function(e) {
			e.preventDefault();
			item.edit_record();
		});
		
		item.view_form.find("#delete-btn").on('click',
			function() {
				item.alert('Cannot be deleted on Demo! Uncomment code in Task/Client line 200!');
			}
		);
	
		// if (item.can_delete()) {
		//	 item.view_form.find("#delete-btn").on('click.task', function(e) {
		//		 e.preventDefault();
		//			 item.delete_record();
		//	 });
		// }   
		
		// else {
		//	 item.view_form.find("#delete-btn").prop("disabled", true);
		// }
		
		create_print_btns(item);
	
		task.view_form_created(item);
		
		if (!(item.master || item.master_field) && item.owner.on_view_form_created) {
			item.owner.on_view_form_created(item);
		}
	
		if (item.on_view_form_created) {
			item.on_view_form_created(item);
		}
		
		item.create_view_tables();
		
		if (!(item.master || item.master_field) && item.view_options.open_item) {
			item.open(true);
		}
	
		if (!table_options_height) {
			item.table_options.height = undefined;
		}
		
		translate_btns(item.view_form.find('.form-footer'));
		return true;
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('.dbtable.' + item.item_name + ' .inner-table').focus();
		
		if ($(window).width() < 480) {
			item.view_form.find("[class='form-header']").css("display", "block");
		}
	}
	
	function on_view_form_closed(item) {
		if (!(item.master || item.master_field) && item.view_options.open_item) {	
			item.close();
		}
	}
	
	function on_edit_form_created(item) {
		item.edit_options.inputs_container_class = 'edit-body';
		item.edit_options.detail_container_class = 'edit-detail';
		
		item.edit_form.find("#cancel-btn").on('click.task', function(e) { item.cancel_edit(e) });
		item.edit_form.find("#ok-btn").on('click.task', function() { item.apply_record() });
		if (!item.is_new() && !item.can_modify) {
			item.edit_form.find("#ok-btn").prop("disabled", true);
		}
		
		task.edit_form_created(item);
		
		if (!(item.master || item.master_field) && item.owner.on_edit_form_created) {
			item.owner.on_edit_form_created(item);
		}
	
		if (item.on_edit_form_created) {
			item.on_edit_form_created(item);
		}
			
		item.create_inputs(item.edit_form.find('.' + item.edit_options.inputs_container_class));
		item.create_detail_views(item.edit_form.find('.' + item.edit_options.detail_container_class));
	
		translate_btns(item.edit_form.find('.form-footer'));
		return true;
	}
	
	function on_edit_form_shown(item) {
		if (item.check_field_value) {
			item.each_field( function(field) {
				var input = item.edit_form.find('input.' + field.field_name);
				input.blur( function(e) {
					var err;
					if ($(e.relatedTarget).attr('id') !== "cancel-btn") {
						err = item.check_field_value(field);
						if (err) {
							item.alert_error(err);
							input.focus();			 
						}
					}
				});
			});
		}
		
		if ($(window).width() < 480) {
			item.edit_form.find("[class='form-header']").css("display", "block");
		}
	}
	
	function on_edit_form_close_query(item) {
		var result = true;
		if (item.is_changing()) {
			result = false;
			if (item.is_modified()) {
				item.yes_no_cancel(task.language.save_changes,
					function() {
						item.apply_record();
					},
					function() {
						item.cancel_edit();
					}
				);
				result = false;
			}
			else {
				item.cancel_edit();
			}
		}
		return result;
	}
	
	function on_filter_form_created(item) {
		item.filter_options.title = item.item_caption + ' - filters';
		item.create_filter_inputs(item.filter_form.find(".edit-body"));
		item.filter_form.find("#cancel-btn").on('click.task', function() {
			item.close_filter_form(); 
		});
		item.filter_form.find("#ok-btn").on('click.task', function() { 
			item.set_order_by(item.view_options.default_order);
			item.apply_filters(item._search_params); 
		});
		if (!item.master && item.owner.on_filter_form_created) {
			item.owner.on_filter_form_created(item);
		}
		if (item.on_filter_form_created) {
			item.on_filter_form_created(item);
		}
		item.create_filter_inputs(item.filter_form.find(".edit-body"));	
		translate_btns(item.filter_form.find('.form-footer'));	
		return true;
	}
	
	function on_param_form_created(item) {
		item.param_form.find("#report_sppiner").hide();
		
		item.create_param_inputs(item.param_form.find(".edit-body"));
		item.param_form.find("#cancel-btn").on('click.task', function() { 
			item.close_param_form();
		});
		item.param_form.find("#ok-btn").on('click.task', function() { 
			item.process_report();
			item.param_form.find("#report_sppiner").show();
		});
		if (item.owner.on_param_form_created) {
			item.owner.on_param_form_created(item);
		}
		if (item.on_param_form_created) {
			item.on_param_form_created(item);
		}
		item.create_param_inputs(item.param_form.find(".edit-body"));	
		translate_btns(item.param_form.find('.form-footer'));
		return true;
	}
	
	function on_before_print_report(report) {
		var select;
		report.extension = 'xls';
		if (report.param_form) {
			select = report.param_form.find('select');
			if (select && select.val()) {
				report.extension = select.val();
			}
		}
	}
	
	function on_view_form_keyup(item, event) {
		if (event.keyCode === 45 && event.ctrlKey === true){
			if (item.master || item.master_field) {
				item.append_record();
			}
			else {
				item.insert_record();				
			}
		}
		else if (event.keyCode === 46 && event.ctrlKey === true){
			item.alert('Cannot be deleted on Demo!');
			// item.delete_record(); 
		}
	}
	
	function on_edit_form_keyup(item, event) {
		if (event.keyCode === 13 && event.ctrlKey === true){
			item.edit_form.find("#ok-btn").focus(); 
			item.apply_record();
		}
	}
	
	function create_print_btns(item) {
		var i,
			$ul,
			$li,
			reports = [];
		if (item.reports) {
			for (i = 0; i < item.reports.length; i++) {
				if (item.reports[i].can_view()) {
					reports.push(item.reports[i]);
				}
			}
			if (reports.length) {
				$ul = item.view_form.find("#report-btn ul");
				for (i = 0; i < reports.length; i++) {
					$li = $('<li><a class="dropdown-item" href="#">' + reports[i].item_caption + '</a></li>');
					$li.find('a').data('report', reports[i]);
					$li.on('click', 'a', function(e) {
						e.preventDefault();
						$(this).data('report').print(false);
					});
					$ul.append($li);
				}
			}
			else {
				item.view_form.find("#report-btn").hide();
			}
		}
		else {
			item.view_form.find("#report-btn").hide();
		}
	}
	
	function translate_btns(container) {
		container.find('.btn').each(function() {
			let btn = $(this).clone();
			btn.find('i', 'small').remove()
			let text = btn.text().trim();
			text = text.split()[0].split('[')[0];
			text = text.trim();
			let translation = task.language[text.toLowerCase()];
			if (translation) {
				$(this).html($(this).html().replace(text, translation)) 
			}
		});
	}
	
	function create_toast_notification(text_var, icon_var) {
		$.toast({
			heading: 'Notification!',
			text: text_var,
			showHideTransition: 'plain',
			icon: icon_var,
			hideAfter: 5000,
			position: 'bottom-right',
			class: 'larger-font'
		});
	}
	
	function navigateToTab(tabIndex) {
		document.querySelectorAll('.nav-link').forEach(tab => {
			tab.classList.remove('active');
		});
		const tabs = document.querySelectorAll('.nav-link');
		const targetTab = tabs[tabIndex];
		if (!targetTab) return; // Exit if tab doesn't exist
		targetTab.classList.add('active');
			const targetPaneId = targetTab.getAttribute('aria-controls') || 
							(targetTab.getAttribute('href') ? targetTab.getAttribute('href').substring(1) : null);
		if (targetPaneId) {
			const targetPane = document.getElementById(targetPaneId);
			if (targetPane) {
				document.querySelectorAll('.tab-pane').forEach(pane => {
				pane.classList.remove('active', 'show');
				});
				targetPane.classList.add('active', 'show');
			}
		}
		targetTab.focus();
	}
	
	document.addEventListener('keydown', (e) => {
		if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
			const tabs = Array.from(document.querySelectorAll('.nav-link'));
			if (tabs.length <= 1) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			const currentIndex = tabs.findIndex(tab => tab.classList.contains('active'));
			let newIndex;
			if (e.key === 'ArrowLeft') {
				newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
			} else {
				newIndex = (currentIndex + 1) % tabs.length;
			}
			navigateToTab(newIndex);
		}
	});
	this.on_page_loaded = on_page_loaded;
	this.on_view_form_created = on_view_form_created;
	this.on_view_form_shown = on_view_form_shown;
	this.on_view_form_closed = on_view_form_closed;
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_edit_form_close_query = on_edit_form_close_query;
	this.on_filter_form_created = on_filter_form_created;
	this.on_param_form_created = on_param_form_created;
	this.on_before_print_report = on_before_print_report;
	this.on_view_form_keyup = on_view_form_keyup;
	this.on_edit_form_keyup = on_edit_form_keyup;
	this.create_print_btns = create_print_btns;
	this.translate_btns = translate_btns;
	this.create_toast_notification = create_toast_notification;
	this.navigateToTab = navigateToTab;
}

task.events.events1 = new Events1();

function Events7() { // northwind_traders.catalogs.customers 

	function on_view_form_created(item) {
		if ($(window).width() < 480) {
			item.table_options.height = 400;
		}
		
		if (!item.lookup_field) {
			item.table_options.height -= 200;
			item.orders = task.orders.copy();
			item.orders.paginate = false;
			item.orders.create_table(item.view_form.find('.view-detail'), {
				height: 200,
				summary_fields: ['order_date'],
	//			on_dblclick: function() {
	//				show_p_order(item.orders);
	//			}
			});
	
		}
	}
	
	var scroll_timeout;
	
	function on_after_scroll(item) {
		if (!item.lookup_field && item.view_form.length) {
			clearTimeout(scroll_timeout);
			scroll_timeout = setTimeout(
				function() {
					if (item.rec_count) {
						item.orders.set_where({customer_id: item.id.value});
						item.orders.set_order_by(['-order_date']);
						//item.orders.open({fields: ['order_date', 'status_id', 'employee_id', 'customer_id', ]});
						item.orders.open(true);
					}
					else {
						item.orders.close();
					}
				},
				100
			);
		}
	}
	function on_edit_form_created(item) {
		if (item.is_new()) {
			item.edit_options.title = 'New entry';
		}   else {
				item.edit_options.title = 'Customer: ' + item.first_name.value.bold() + ' ' + item.last_name.value.bold();
		}
		
		let send_email_btn = item.add_edit_button('Send email', {type: 'success', image: 'icon-pencil', btn_id: 'send_email_btn'});
			send_email_btn.click(function() { 
				//item.warning('Email sending...');
				task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
			});
		
		//send email
		// item.edit_form.find("#send_email_btn").click(function(e) {
		//	 task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
		// });
			
		//inputs
		// item.edit_form.find('#customer-tabs a').click(function (e) {
		//	 e.preventDefault();
		//	 $(this).tab('show');
		// });
		
		// item.create_inputs(item.edit_form.find("#top-row"), {
		//	 fields: ['company']
		// });
		
		// item.create_inputs(item.edit_form.find("#primary-contacts"), {
		//	 fields: ['first_name', 'last_name', 'job_title']
		// });
		
		// item.create_inputs(item.edit_form.find("#phone-numbers"), {
		//	 fields: ['business_phone', 'mobile_phone', 'fax_number']
		// });
		
		// item.create_inputs(item.edit_form.find("#address-data"), {
		//	 fields: ['address', 'city', 'state_province', 'zip_postal_code', 'country_region']
		// });
		
		// item.create_inputs(item.edit_form.find("#web-data"), {
		//	 fields: ['email_address', 'web_page', 'attachments']
		// });
		
		// item.create_inputs(item.edit_form.find("#notes-data"), {
		//	 fields: ['notes']
		// });
	}
	this.on_view_form_created = on_view_form_created;
	this.on_after_scroll = on_after_scroll;
	this.on_edit_form_created = on_edit_form_created;
}

task.events.events7 = new Events7();

function Events8() { // northwind_traders.catalogs.employees 

	function on_view_form_created(item) {
		if ($(window).width() < 480) {
			item.table_options.height = 400;
		}
	
		if (!item.lookup_field) {
			item.table_options.height -= 200;
			item.orders = task.orders.copy();
			item.orders.paginate = false;
			item.orders.create_table(item.view_form.find('.view-detail'), {
				height: 200,
				summary_fields: ['order_date'],
	//			on_dblclick: function() {
	//				show_p_order(item.orders);
	//			}
			});
	
		}
	}
	
	var scroll_timeout;
	
	function on_after_scroll(item) {
		if (!item.lookup_field && item.view_form.length) {
			clearTimeout(scroll_timeout);
			scroll_timeout = setTimeout(
				function() {
					if (item.rec_count) {
						item.orders.set_where({employee_id: item.id.value});
						item.orders.set_order_by(['-order_date']);
						//item.orders.open({fields: ['order_date', 'status_id', 'employee_id', 'customer_id', ]});
						item.orders.open(true);
					}
					else {
						item.orders.close();
					}
				},
				100
			);
		}
	}
	
	function on_edit_form_created(item) {
		item.id.read_only = true;
		
		if (item.is_new()) {
			item.edit_options.title = 'New employee entry';
		}   else {
			item.edit_options.title = 'Employee entry preview: ' + item.first_name.value + '  ' + item.last_name.value;
		}
	
		let send_email_btn = item.add_edit_button('Send email', {type: 'success', image: 'icon-pencil', btn_id: 'send_email_btn'});
			send_email_btn.click(function() { 
				//item.warning('Email sending...');
				task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
			});
	
		
		//send email
		// item.edit_form.find("#send_email_btn").click(function(e) {
		//	 task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
		// });
		
		// //inputs
		// item.edit_form.find('#customer-tabs a').click(function (e) {
		//	 e.preventDefault();
		//	 $(this).tab('show');
		// });
		
		// item.create_inputs(item.edit_form.find("#top-row"), {
		//	 fields: ['company']
		// });
		
		// item.create_inputs(item.edit_form.find("#primary-contacts"), {
		//	 fields: ['first_name', 'last_name', 'job_title']
		// });
		
		// item.create_inputs(item.edit_form.find("#phone-numbers"), {
		//	 fields: ['business_phone', 'mobile_phone', 'fax_number']
		// });
		
		// item.create_inputs(item.edit_form.find("#address-data"), {
		//	 fields: ['address', 'city', 'state_province', 'zip_postal_code', 'country_region']
		// });
		
		// item.create_inputs(item.edit_form.find("#web-data"), {
		//	 fields: ['email_address', 'web_page', 'attachments']
		// });
		
		// item.create_inputs(item.edit_form.find("#notes-data"), {
		//	 fields: ['notes']
		// });
	}
	
	function on_edit_form_shown(item) {
		item.edit_form.find('input.id').width(80);
		item.edit_form.find('input.company').focus();
	}
	
	function on_before_open(item, params) {
		item.edit_options.template_class = 'customers-edit';
	}
	this.on_view_form_created = on_view_form_created;
	this.on_after_scroll = on_after_scroll;
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_before_open = on_before_open;
}

task.events.events8 = new Events8();

function Events9() { // northwind_traders.catalogs.suppliers 

	function on_view_form_created(item) {
		if ($(window).width() < 480) {
			item.table_options.height = 400;
		}
		if (!item.lookup_field) {
			item.table_options.height -= 200;
			item.purchase_orders = task.purchase_orders.copy();
			item.purchase_orders.paginate = false;
			item.purchase_orders.create_table(item.view_form.find('.view-detail'), {
				height: 200,
				summary_fields: ['submitted_date', 'purchase_order_id'],
			//	 on_dblclick: function() {
			//		 show_p_order(item.order_details);
			//	 }
			});
	
		}
	}
	
	var scroll_timeout;
	
	function on_after_scroll(item) {
		if (!item.lookup_field && item.view_form.length) {
			clearTimeout(scroll_timeout);
			scroll_timeout = setTimeout(
				function() {
					if (item.rec_count) {
						item.purchase_orders.set_where({supplier_id: item.id.value});
						item.purchase_orders.set_order_by(['-submitted_date']);
						item.purchase_orders.open(true);
					}
					else {
						item.purchase_orders.close();
					}
				},
				100
			);
		}
	}
	function on_edit_form_created(item) {
		if (item.is_new()) {
			item.edit_options.title = 'New entry';
		}   else {
			item.edit_options.title = 'Supplier preview:  ' + item.company.value;
		}
	
		let send_email_btn = item.add_edit_button('Send email', {type: 'success', image: 'icon-pencil', btn_id: 'send_email_btn'});
			send_email_btn.click(function() { 
				//item.warning('Email sending...');
				task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
			});
		
		// //send email
		// item.edit_form.find("#send_email_btn").click(function(e) {
		//	 task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
		// });
			
		// //inputs
		// item.edit_form.find('#customer-tabs a').click(function (e) {
		//	 e.preventDefault();
		//	 $(this).tab('show');
		// });
		
		// item.create_inputs(item.edit_form.find("#top-row"), {
		//	 fields: ['company']
		// });
		
		// item.create_inputs(item.edit_form.find("#primary-contacts"), {
		//	 fields: ['first_name', 'last_name', 'job_title']
		// });
		
		// item.create_inputs(item.edit_form.find("#phone-numbers"), {
		//	 fields: ['business_phone', 'mobile_phone', 'fax_number']
		// });
		
		// item.create_inputs(item.edit_form.find("#address-data"), {
		//	 fields: ['address', 'city', 'state_province', 'zip_postal_code', 'country_region']
		// });
		
		// item.create_inputs(item.edit_form.find("#web-data"), {
		//	 fields: ['email_address', 'web_page', 'attachments']
		// });
		
		// item.create_inputs(item.edit_form.find("#notes-data"), {
		//	 fields: ['notes']
		// });
	}
	
	function send_email(item, email_address, first_name, last_name) {
		task.mail.open({open_empty: true});
		task.mail.edit_options.title = 'Send email to: ' + first_name + ' ' + last_name;
		task.mail.append_record();
		
		task.mail.email_address.value = email_address;
		task.mail.edit_form.find('input.subject').focus();
	}
	
	function on_before_open(item, params) {
		item.edit_options.template_class = 'customers-edit';
	}
	this.on_view_form_created = on_view_form_created;
	this.on_after_scroll = on_after_scroll;
	this.on_edit_form_created = on_edit_form_created;
	this.send_email = send_email;
	this.on_before_open = on_before_open;
}

task.events.events9 = new Events9();

function Events10() { // northwind_traders.catalogs.products 

	function on_field_get_html(field){
		if (field.field_name === 'product_name' && field.value){
			return '<h5><span class="badge bg-primary">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'category' && field.value){
			return '<h5><span class="badge bg-success">' + field.display_text + '</span></h5>';
		}
	}
	
	function on_field_get_text(field) {
		if (field.field_name === 'supplier_ids' && field.value){
			let suppliers = task.suppliers.copy({handlers: false}),
				suppliers_list = [];
				
				suppliers.set_where({id__in: field.value});
				suppliers.open({fields: ['company']});
				
				suppliers.each(function(s){
				   suppliers_list.push(s.company.value); 
				});
	
				return suppliers_list;
		}
	}
	function on_view_form_created(item) {
		/*if ($(window).width() < 480) {
			item.table_options.height = 400;
		}*/
		
		item.table_options.height = 600;
	
		item.add_view_button('Pump data', {type: 'primary', image: 'bi bi-server', btn_id: 'pump_product_data'}).click(function() {
			pump_product_data(item);		
		});			
		
		if (!item.lookup_field) {
			item.table_options.height -= 200;
			item.order_details = task.order_details.copy();
			item.order_details.paginate = false;
			item.order_details.create_table(item.view_form.find('.view-detail'), {
				height: 200,
				fields: ['customer', 'employee', 'order_date', 'date_allocated', 'quantity', 'discount', 'total_price'],
				summary_fields: ['customer', 'quantity', 'total_price'],
				on_dblclick: function() {
					show_order(item.order_details);
				}
			});
			task.create_toast_notification('Double-click the record in the bottom table to see the order in which the product was sold.', 'info');
			
		}
	}
	
	var scroll_timeout;
	
	function on_after_scroll(item) {
		if (!item.lookup_field && item.view_form.length) {
			clearTimeout(scroll_timeout);
			scroll_timeout = setTimeout(
				function() {
					if (item.rec_count) {
						item.order_details.set_where({product_id: item.id.value});
						item.order_details.set_order_by(['-date_allocated']);
						item.order_details.open(true);
					}
					else {
						item.order_details.close();
					}
				},
				100
			);
		}
	}
	
	function show_order(order_details) {
		var orders = task.orders.copy();
		orders.set_where({order_id: order_details.order_id.value});
		orders.open(function(i) {
			i.edit_options.modeless = false;
			i.can_modify = false;
			i.order_details.on_after_open = function(t) {
				t.locate('id', order_details.order_id.value);
			};
			i.edit_record();
		});
	}
	function on_edit_form_created(item) {
		if (item.is_new()) {
			item.edit_options.title = 'New product';
		}   else {
			item.edit_options.title = 'Product ID: ' + item.id.value;
		}
	}
	
	function on_edit_form_shown(item) {
		if  ($(window).width() > 480) {
			item.edit_form.find('input.standard_cost, input.target_level, input.minimum_reorder_quantity, input.reorder_level, input.list_price').width(100);
			item.edit_form.find('input.attachments').parent().width(400);
		}
		
		//hide purchase_order_details tab when new record
		if (item.is_new()) {
			$('[href="#tab11"]').hide();
		}
		
		//show purchase_order_details in tab 
		$(".edit-body").find("li").on("click", function() {
			if ($(".edit-body").find("li.active a").text() == ("Orders History") ) {
				$(".purchase_details").css("display","block");
		
				let purchase_details = task.purchase_order_details.copy();
					purchase_details.set_where({product_id: item.id.value});
					purchase_details.set_order_by(['-date_received']);
					purchase_details.view_options.template_class = 'default-view';
					purchase_details.view_options.form_header = false;
					purchase_details.table_options.height = 400; 
					purchase_details.view(item.edit_form.find(".purchase_details"));
					purchase_details.view_form.find('.form-footer').hide();
					
				purchase_details.on_edit_form_created = function(c){
					c.read_only = true;
				};
			}   else {
					$(".purchase_details").css("display","none");
				}
		});
	}
	
	function pump_product_data(item) {
		item.warning('Not in Demo! Uncomment code in Products!');	
	}
	
	// function pump_product_data(item) {
	//	 item.alert('This will take a while in the background. The database will be locked!');
	//	 item.server('pump_product_data', 
	//		 function(result, err) {
	//			 if (err) {
	//				 item.alert_error('Failed to pump data: ' + err);
	//				 item.edit();
	//			 }
	//			 else {
	//				 item.alert('Successfully pumped');
	//				 item.close_edit_form();
	//				 item.delete();			
	//			 }
	//		 }
	//	 );
	//	 item.refresh();
	
		
	// }
	this.on_field_get_html = on_field_get_html;
	this.on_field_get_text = on_field_get_text;
	this.on_view_form_created = on_view_form_created;
	this.on_after_scroll = on_after_scroll;
	this.show_order = show_order;
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.pump_product_data = pump_product_data;
}

task.events.events10 = new Events10();

function Events11() { // northwind_traders.catalogs.shippers 

	function on_view_form_created(item) {
		if (!item.lookup_field) {
			item.table_options.height -= 200;
			item.orders = task.orders.copy();
			item.orders.paginate = false;
			item.orders.create_table(item.view_form.find('.view-detail'), {
				height: 200,
				summary_fields: ['order_date'],
	//			on_dblclick: function() {
	//				show_p_order(item.orders);
	//			}
			});
	
		}
	}
	
	var scroll_timeout;
	
	function on_after_scroll(item) {
		if (!item.lookup_field && item.view_form.length) {
			clearTimeout(scroll_timeout);
			scroll_timeout = setTimeout(
				function() {
					if (item.rec_count) {
						item.orders.set_where({shipper_id: item.id.value});
						item.orders.set_order_by(['-order_date']);
						//item.orders.open({fields: ['order_date', 'status_id', 'employee_id', 'customer_id', ]});
						item.orders.open(true);
					}
					else {
						item.orders.close();
					}
				},
				100
			);
		}
	}
	function on_edit_form_created(item) {
		if (item.is_new()) {
			item.edit_options.title = 'New entry';
		}   else {
			item.edit_options.title = item.company.value;
		}
		
		//send email
		item.edit_form.find("#send_email_btn").click(function(e) {
			task.suppliers.send_email(item, item.email_address.value, item.first_name.value, item.last_name.value);
		});
			
		//inputs
		item.edit_form.find('#customer-tabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
		
		item.create_inputs(item.edit_form.find("#top-row"), {
			fields: ['company']
		});
		
		item.create_inputs(item.edit_form.find("#primary-contacts"), {
			fields: ['first_name', 'last_name', 'job_title']
		});
		
		item.create_inputs(item.edit_form.find("#phone-numbers"), {
			fields: ['business_phone', 'mobile_phone', 'fax_number']
		});
		
		item.create_inputs(item.edit_form.find("#address-data"), {
			fields: ['address', 'city', 'state_province', 'zip_postal_code', 'country_region']
		});
		
		item.create_inputs(item.edit_form.find("#web-data"), {
			fields: ['email_address', 'web_page', 'attachments']
		});
		
		item.create_inputs(item.edit_form.find("#notes-data"), {
			fields: ['notes']
		});
	}
	
	function on_before_open(item, params) {
		item.edit_options.template_class = 'customers-edit';
	}
	this.on_view_form_created = on_view_form_created;
	this.on_after_scroll = on_after_scroll;
	this.on_edit_form_created = on_edit_form_created;
	this.on_before_open = on_before_open;
}

task.events.events11 = new Events11();

function Events13() { // northwind_traders.orders_menu.orders 

	function on_view_form_created(item) {
		item.table_options.height = 600;
		
		//custom delete check
		item.view_form.find("#delete-btn").off('click.task').on('click', function(e) {
			e.preventDefault();
			
			if (item.order_details.rec_count) {
				item.warning('First delete order details from this Order!');
				item.abort();
			}   else {
					item.delete_record();
				}
		});
		
		let order_view_actions_div = $(
			'<div class="dropdown">'+
			'   <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">'+
			'	   <i class="bi bi-menu-down"></i>&nbsp; Actions - testing'+
			'   </button>'+
			'   <ul class="dropdown-menu">'+
			'	   <li><a id="pump_data_btn" class="dropdown-item" href="#"><i class="bi bi-database-gear"></i>&nbsp; Pump data</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="update_year_btn" class="dropdown-item" href="#"><i class="bi bi-calendar-check"></i>&nbsp; Update year</a></li>'+
			'   </ul>'+
			'</div>'
			);
		 
			item.view_form.find('[class="form-header"]').append(order_view_actions_div);
			
			//pump data
			item.view_form.find("#pump_data_btn").click(function(e) {
				item.question('Pump data?', function () {
					pump_data(item);		
				});
			});
			
			//update year
			item.view_form.find("#update_year_btn").click(function(e) {
				update_year(item);		
			});
	}
	
	function update_year(item){
		task.create_toast_notification('Not in Demo! Uncomment code in Orders!', 'error');	
		/*item.question('Would you like to update date to the current year?',
			function() {
				item.server('update_year', function(res, error) {
					if (error) {
						item.warning(error);
					}   else {
						item.alert('Successfully updated!');
						item.refresh();
					}
				});
			 }
		);*/
	}
	
	function pump_data(item) {
		task.create_toast_notification('Not in Demo! Uncomment code in Orders!', 'error');	
		/*item.alert('This will take a while in the background. The database will be locked!');
		item.server('pump_data', 
			function(result, err) {
				if (err) {
					item.alert_error('Failed to pump data: ' + err);
					item.edit();
				}   else {
					item.alert('Successfully pumped');
					item.close_edit_form();
					item.delete();			
				}
			}
		);*/
	}
	
	function on_edit_form_created(item) {
		item.customer_id.required = true;
		item.employee_id.required = true;
		item.order_date.required = true;
		item.status_id.read_only = true;
	
		if (item.is_new()) {
			item.edit_options.title = 'New order entry';
			item.employee_id.value = 5; //task.user_info.user_id;
			item.employee_id.lookup_value = 'Steven Thorpe'; //task.user_info.user_name;
			item.order_date.value = new Date();
		}   else {
			item.edit_options.title = 'Order: #' + item.order_id.value;
		}
		
		if (item.status_id.value === 3) {
			item.read_only = true;
		}   else {
			item.read_only = false;
		}
		
		let order_actions_div = $(
			'<div class="dropdown">'+
			'   <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">'+
			'	   <i class="bi bi-menu-down"></i>&nbsp; Actions'+
			'   </button>'+
			'   <ul class="dropdown-menu">'+
			'	   <li><a id="clear_address_btn" class="dropdown-item" href="#"><i class="bi bi-backspace"></i>&nbsp; Clear Address</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="create_invoice_btn" class="dropdown-item" href="#"><i class="bi bi-file-earmark-pdf"></i>&nbsp; Create Invoice</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="print_invoice_btn" class="dropdown-item" href="#"><i class="bi bi-printer"></i>&nbsp; Print Invoice</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="ship_order_btn" class="dropdown-item" href="#"><i class="bi bi-truck"></i>&nbsp; Ship Order</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="complete_order_btn" class="dropdown-item" href="#"><i class="bi bi-clipboard-check"></i>&nbsp; Complete Order</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="cancel_order_btn" class="dropdown-item" href="#"><i class="bi bi-x-octagon"></i>&nbsp; Cancel Order</a></li>'+
			'   </ul>'+
			'</div>'
			);
		 
			item.edit_form.find('[class="form-header"]').append(order_actions_div);
				
			//clear address
			item.edit_form.find("#clear_address_btn").click(function(e) {
				clear_address_data(item);
			});
				
			//invoiced - 1
			item.edit_form.find("#create_invoice_btn").click(function(e) {
				if (!item.status_id.value) {
					create_invoice(item);
				}   else {
					item.warning('Invoice is already created!');
				}
			});
				
			//print
			item.edit_form.find("#print_invoice_btn").click(function(e) {
				if (item.status_id.value > 0) {
					print_invoice(item);
				}   else {
					item.warning('First create Invoice!');
				}
			});
				
			//shipped - 2
			item.edit_form.find("#ship_order_btn").click(function(e) {
				if (item.status_id.value == 1) {
					ship_order(item);
				}
					
				else if (!item.status_id.value) {
					item.warning('Cannot mark as shipped. Order must first be invoiced!');
				}
					
				else {
					item.warning('Order is already shipped!');
				}
			});
				
			//completed - 3
			item.edit_form.find("#complete_order_btn").click(function(e) {
				if (item.status_id.value == 2) {
					complete_order(item);
				}   else {
					item.warning('Cannot mark as completed!');
				}
			});
				
			//canceled - 4
			item.edit_form.find("#cancel_order_btn").click(function(e) {
				if (item.status_id.value === 0) {
					cancel_order(item);
				}   else {
					item.warning('Order is not New, cannot be canceled!');
				}
			});
	}
	
	function on_edit_form_shown(item) {
		if ($(window).width() > 480) {
			item.edit_form.find('input.shipper_id').width(180);
			item.edit_form.find('input.ship_name, input.ship_address, input.ship_city, input.ship_state_province, input.ship_country_region, input.ship_zip_postal_code').width(450);
			item.edit_form.find('.edit-body').height(430);
		}
		
		item.edit_form.find('input.customer_id').focus();
		item.edit_form.find('input.payment_type, input.shipping_fee').width(120);
		item.edit_form.find('input.shipped_date, input.order_date, input.paid_date').parent().width(200);
		
		//payment options
		let payment_options_list = ['Credit Card', 'Cash', 'Check'],
			datalist_html = '<datalist id="dynamicList">';
			
			payment_options_list.forEach(function(option) {
				datalist_html += '<option value="' + option + '">';
			});
			
			datalist_html += '</datalist>';
	
			item.edit_form.find('#orders-payment_type-id').after(datalist_html);
			item.edit_form.find('#orders-payment_type-id').attr('list', 'dynamicList');
	}
	
	function on_field_changed(field, lookup_item) {
		let item = field.owner;
		
		if (field.field_name ==='customer_id' && lookup_item) {
			if (field.value) {
				item.ship_name.value = lookup_item.first_name.value + ' ' + lookup_item.last_name.value;
				item.ship_address.value = lookup_item.address.value;
				item.ship_city.value = lookup_item.city.value;
				item.ship_state_province.value = lookup_item.state_province.value;
				item.ship_zip_postal_code.value = lookup_item.zip_postal_code.value;
				item.ship_country_region.value = lookup_item.country_region.value;
				
				item.post();
				item.apply();
				item.edit();
				item.refresh_record();
				
				item.customer_id.read_only = true;
			}
		}
		
		if (field.field_name ==='shipper_id' && field.value) {
			item.apply();
			item.edit();
		}
	}
	
	function clear_address_data(item) {
		item.question('Would you like to clear Address information?',
			function() {
				item.ship_name.value = '';
				item.ship_address.value = '';
				item.ship_city.value = '';
				item.ship_state_province.value = '';
				item.ship_zip_postal_code.value = '';
				item.ship_country_region.value = '';
			});
	}
	
	function create_invoice(item) {
		if (item.shipper_id.value && item.order_details.rec_count) {
			item.question('Would you like to create Invoice?',
				function() {
					item.server('invoice_order', [item.order_id.value, item.shipping_fee.value], function (res, error) {
						if (error) {
							item.warning(error);
						}   else {
								item.refresh_record();
								item.status_id.value = 1;
								item.apply();
								item.refresh_record();
								item.edit();
								task.create_toast_notification('Invoice is successfully created!', 'success');
							}
						}
					);	
			});
		}
						
		else if (!item.shipper_id.value){
			item.warning('Shipper ID is required!');
		}
				
		else if (!item.order_details.rec_count){
			item.warning('Order must contain all lest one detail!');
		}
	}
	
	function ship_order(item) {
		if (item.status_id.value == 1) {
			if (item.shipper_id.value) {
				item.question('Would you like to ship this order?',
					function() {
						item.edit();
						item.shipped_date.value = new Date();
						item.status_id.value = 2;
						item.post();
						item.apply();
						item.close_edit_form();
						task.create_toast_notification('Order is shipped!', 'success');
					}
				);
			}   else {
				item.warning('Please provide Shipper information!');
			}
		}
	}
	
	function complete_order(item) {
		if (item.paid_date.value && item.payment_type.value) {
			item.question('Would you like to complete this order?',
				function() {
					item.status_id.value = 3;
					item.post();
					item.apply();
					item.close_edit_form();
					task.create_toast_notification('Order is completed!', 'success');
				}
			);
		} else {
			item.warning('Payment info are required!');
		}
	}
	
	function on_after_post(item) {
		if (item.is_new()) {
			item.status_id.value = 0;
		}
	}
	
	function print_invoice(item) {
		task.invoice.order_id.value = item.order_id.value;
		task.invoice.print(true);
	}
	
	function on_field_get_html(field) {
		let item = field.owner;
		
		if (field.field_name === 'customer_id' || field.field_name === 'shipper_id') {
			if (field.value) {
				return '<h5><span class="badge bg-primary">' + field.display_text + '</span></h5>';
			}
		}
		
		if (field.field_name === 'employee_id' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + ' ' + item.employee_last_name.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'status_id' && field.value) {
			return '<h5><span class="badge bg-success">' + field.display_text + '</span></h5>';
		}
	}
	
	function on_filter_form_shown(item) {
		item.filter_form.find('input.order_date, input.shipped_date').parent().width(200);
	}
	
	function on_after_delete(item) {
		if (item.selections.length > 0) {
			item.selections = [];
		}
	}
	
	function on_field_get_text(field) {
		let item = field.owner;
		
		if (item.edit_form) {
			if (field.field_name === 'employee_id' && field.value) {
				return field.display_text + ' ' + item.employee_last_name.display_text;
			}
		}
	}
	this.on_view_form_created = on_view_form_created;
	this.update_year = update_year;
	this.pump_data = pump_data;
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_field_changed = on_field_changed;
	this.clear_address_data = clear_address_data;
	this.create_invoice = create_invoice;
	this.ship_order = ship_order;
	this.complete_order = complete_order;
	this.on_after_post = on_after_post;
	this.print_invoice = print_invoice;
	this.on_field_get_html = on_field_get_html;
	this.on_filter_form_shown = on_filter_form_shown;
	this.on_after_delete = on_after_delete;
	this.on_field_get_text = on_field_get_text;
}

task.events.events13 = new Events13();

function Events14() { // northwind_traders.orders_menu.invoices 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.order_id').parent().width(250);
		item.edit_form.find('input.customer, input.company').width(230);
		item.edit_form.find('input.invoice_date, input.due_date').parent().width(200);
		item.edit_form.find('input.tax, input.shipping, input.amount_due, input.invoice_id').width(80);
	}
	
	function on_filter_form_shown(item) {
		item.filter_form.find('input.invoice_date, input.due_date').parent().width(200);
	}
	
	function on_field_get_text(field) {
		let item = field.owner;
		
		if (field.field_name === 'customer') {
			return field.display_text + ' ' + item.customer_last_name.display_text;
		}
	}
	
	function on_edit_form_created(item) {
		item.order_id.read_only = true;
	}
	
	function on_view_form_created(item) {
		item.add_view_button('Print Invoice', {type: 'primary', image: 'bi bi-printer', btn_id: 'print_invoice_btn'}).click(function() {
			print_invoice(item);
		});
	}
	
	function print_invoice(item) {
		task.invoice.order_id.value = item.order_id.value;
		task.invoice.print(true);
	}
	
	function on_field_get_html(field) {
		if (field.field_name === 'company' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
	}
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_filter_form_shown = on_filter_form_shown;
	this.on_field_get_text = on_field_get_text;
	this.on_edit_form_created = on_edit_form_created;
	this.on_view_form_created = on_view_form_created;
	this.print_invoice = print_invoice;
	this.on_field_get_html = on_field_get_html;
}

task.events.events14 = new Events14();

function Events17() { // northwind_traders.inventory_menu.inventory_transactions 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.transaction_created_date, input.transaction_modified_date').parent().width(200);
		item.edit_form.find('input.quantity').width(80);
		item.edit_form.find('input.customer_order_id, input.purchase_order_id').parent().width(200);
	}
	
	function on_filter_form_shown(item) {
		item.filter_form.find('input.transaction_created_date, input.transaction_modified_date').parent().width(200);
	}
	
	function on_edit_form_created(item) {
		item.customer_order_id.read_only = true;
		item.purchase_order_id.read_only = true;
		item.transaction_type.read_only = true;
		
		if (item.is_new()) {
			item.edit_options.title = 'New inventory transaction entry';
		}   else {
			item.edit_options.title = 'Inventory transaction preview: #' + item.transaction_id.value;
		}
	}
	
	function on_field_get_html(field) {
		if (field.field_name === 'transaction_type' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'product_id' && field.value) {
			return '<h5><span class="badge bg-success">' + field.display_text + '</span></h5>';
		}
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('#new-btn, #delete-btn').hide();
	}
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_filter_form_shown = on_filter_form_shown;
	this.on_edit_form_created = on_edit_form_created;
	this.on_field_get_html = on_field_get_html;
	this.on_view_form_shown = on_view_form_shown;
}

task.events.events17 = new Events17();

function Events22() { // northwind_traders.inventory_menu.inventory_transaction_types 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.id').width(80);
		item.edit_form.find('input.type_name').focus();
	}
	this.on_edit_form_shown = on_edit_form_shown;
}

task.events.events22 = new Events22();

function Events24() { // northwind_traders.orders_menu.orders_status 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.status_id').width(80);
		item.edit_form.find('input.status_id').focus();   
	}
	this.on_edit_form_shown = on_edit_form_shown;
}

task.events.events24 = new Events24();

function Events26() { // northwind_traders.orders_menu.purchase_order_status 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.status_id').width(60);
		item.edit_form.find('input.status').focus();
	}
	this.on_edit_form_shown = on_edit_form_shown;
}

task.events.events26 = new Events26();

function Events28() { // northwind_traders.inventory_menu.purchase_orders 

	function on_edit_form_created(item) {
		item.created_by.read_only = true;
		item.submitted_by.read_only = true;
		item.approved_by.read_only = true;
		item.creation_date.read_only = true;
		item.submitted_date.read_only = true;
		item.approved_date.read_only = true;
		item.status_id.read_only = true;
			
		if (item.is_new()) {
			item.edit_options.title = 'New Purchase order entry';
			item.created_by.value = 5; //task.user_info.user_id;
			item.created_by.lookup_value = 'Steven Thorpe'; //task.user_info.user_name;
			item.creation_date.value = new Date();
	
		}   else {
			item.edit_options.title = 'Purchase order #' + item.purchase_order_id.value;
		}
		
		item.add_edit_button('Submitt PO', {type: 'primary', image: 'bi bi-send', btn_id: 'submitt_po_btn'}).click(function() {
			submitt_po(item);
		});
		
		item.add_edit_button('Approve PO', {type: 'success', image: 'bi bi-patch-check', btn_id: 'approve_po_single'}).click(function() {
			approve_po_single(item);
		});
	}
	
	function on_edit_form_shown(item) {
		item.edit_form.find('input.payment_method').width(100);
		item.edit_form.find('input.approved_date, input.creation_date, input.expected_date, input.payment_date, input.submitted_date').parent().width(200);
		
		item.edit_form.find('input.supplier_id').focus();
		
		if (item.is_new()) {
			item.edit_options.title = 'New purchase';
			item.edit_form.find("#approve_po_single").hide();
		}
		
		if (!item.is_new()) {
			item.supplier_id.read_only = true;
		} else {
			item.supplier_id.read_only = false;
		}
		
		//only maganger can see approve btn
		if (task.user_info.user_id > 2) {
			item.edit_form.find("#approve_po_single").hide();
		}
		
		if (item.status_id.value >= 1) {
			item.edit_form.find("#submitt_po_btn").hide();
		}
		
		if (!item.status_id.value || item.status_id.value >= 2) {
			item.edit_form.find("#approve_po_single").hide();
		}
		
		//payment options
		var payment_options_list = ['Credit Card', 'Cash', 'Check'],
			datalist_html = '<datalist id="dynamicList">';
			
			payment_options_list.forEach(function(option) {
				datalist_html += '<option value="' + option + '">';
			});
			
			datalist_html += '</datalist>';
	
			item.edit_form.find('#purchase_orders-payment_method-id').after(datalist_html);
			item.edit_form.find('#purchase_orders-payment_method-id').attr('list', 'dynamicList');
	}
	
	function on_view_form_created(item) {
		item.table_options.multiselect = true;
		item.table_options.height = 600;
		
		let po_view_actions_div = $(
			'<div class="dropdown">'+
			'   <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">'+
			'	   <i class="bi bi-menu-down"></i>&nbsp; Actions'+
			'   </button>'+
			'   <ul class="dropdown-menu">'+
			'	   <li><a id="for_approve_btn" class="dropdown-item" href="#"><i class="bi bi-filter"></i>&nbsp; Show - for approve</a></li>'+
			'	   <li><a id="show_all_btn" class="dropdown-item" href="#"><i class="bi bi-filter"></i>&nbsp; Show - all</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="approve_multipe_btn" class="dropdown-item" href="#"><i class="bi bi-ui-checks"></i>&nbsp; Approve PO - multiple</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="approve_single_btn" class="dropdown-item" href="#"><i class="bi bi-check2-square"></i>&nbsp; Approve PO - single</a></li>'+
			'	   <li><hr class="dropdown-divider"></li>'+
			'	   <li><a id="cancel_po_btn" class="dropdown-item" href="#"><i class="bi bi-x-octagon"></i>&nbsp; Cancel PO</a></li>'+
			'   </ul>'+
			'</div>'+
			'<div class="dropdown">'+
			'   <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">'+
			'	   <i class="bi bi-menu-down"></i>&nbsp; Actions - testing'+
			'   </button>'+
			'   <ul class="dropdown-menu">'+
			'	   <li><a id="pump_data_po_btn" class="dropdown-item" href="#"><i class="bi bi-database-gear"></i>&nbsp; Pump data</a></li>'+
			'   </ul>'+
			'</div>'
			);
		 
			item.view_form.find('[class="form-header"]').append(po_view_actions_div);
			
			//show for approve
			item.view_form.find("#for_approve_btn").click(function(e) {
				item.filters.status_id.value = [1];
				item.refresh_page();
				task.create_toast_notification('PO for approve are shown!', 'info');
			});
			
			//show all
			item.view_form.find("#show_all_btn").click(function(e) {
				item.clear_filters();
				item.refresh_page();
				task.create_toast_notification('All PO are shown!', 'info');
			});
			
			//approve multipe po
			item.view_form.find("#approve_single_btn").click(function(e) {
				approve_po_single(item);
			});
			
			//approve single po
			item.view_form.find("#approve_multipe_btn").click(function(e) {
				approve_po_multiple(item);
			});
			
			//cancel po
			item.view_form.find("#cancel_po_btn").click(function(e) {
				cancel_po(item);
			});
			
			//pump data
			item.view_form.find("#pump_data_po_btn").click(function(e) {
				item.question('Pump data?', 
					function () {
						pump_po_data(item);		
					});
			});
		
		//custom delete check
		item.view_form.find("#delete-btn").off('click.task').on('click', function(e) {
			e.preventDefault();
			
			if (item.purchase_order_details.rec_count) {
				item.warning('First delete order details from this Order!');
				item.abort();
			}   else {
					item.delete_record();
				}
		});
	}
	
	function pump_po_data(item) {
		item.warning('Not in Demo! Uncomment code in PO!');	
	}
	
	// function pump_po_data(item) {
	//	 item.alert('This will take a while in the background. The database will be locked!');
	//	 item.server('pump_po_data', 
	//		 function(result, err) {
	//			 if (err) {
	//				 item.alert_error('Failed to pump data: ' + err);
	//				 item.edit();
	//			 }   else {
	//				 item.alert('Successfully pumped');
	//				 item.close_edit_form();
	//				 item.delete();			
	//			 }
	//		 }
	//	 );
	// }
	
	function to_approve(item){
		item.alert('Not yet implemented!');
	}
	
	function approve_po_single(item){
		if (item.status_id.value == 1) {
			if (item.purchase_order_details.rec_count) {
					item.question('Would you like to approve purchase the order #'+ item.purchase_order_id.value + '?',
						function() {
							item.edit();
							item.status_id.value = 2;
						
							if (!item.approved_date.value) {
								item.approved_date.value = new Date();
							}
								
							item.approved_by.value = task.user_info.user_id;
							item.approved_by.lookup_value = task.user_info.user_name;
							item.apply_record();
							task.create_toast_notification('Purchase order #' + item.purchase_order_id.value + ' is approved!', 'success');
						}
					);
			}   else {
					task.create_toast_notification('Purchase order must have details to be approved!', 'error');
				}
		}   else {
			task.create_toast_notification('Purchase order is not in correct status to be approved!', 'error');
		}
	}
	
	function approve_po_multiple(item){
		let selections = item.selections,
			selectionss = [];
			
			if (selections.length === 0) {
				selections = [item.id.value];
			}
		
		item.question('Would you like to approve the purchase for  (' + selections.length + ')  orders??',
			function() {
				item.server('approve_po_multiple', [selections], function(res, error) {
					if (error) {
						item.warning(error);
					}   else {
						item.selections = [];
						item.refresh();
						task.create_toast_notification('DONE for: ('+ selections.length + ')!', 'success');
					}
			});
		});
	}
	
	function cancel_po(item){
		item.purchase_order_details.set_where({posted_to_inventory: true});
		item.purchase_order_details.open();
		
		if (!item.status_id.value) {
			if (item.purchase_order_details.rec_count) {
				item.warning('Deletion is prohibited! There are products received  and posted to inventory!');
			}   else {
				item.question('Do you realy want to cancel order and delete it permanently?',
					function() {
						item.delete();
						task.create_toast_notification('Purchase order has deleted!', 'success');
					});
			}
		}   else {
			task.create_toast_notification('Deletion is prohibited in this PO status', 'error');
		}
	}
	
	function on_field_get_html(field) {
		let item = field.owner;
		
		if (field.field_name === 'supplier_id' && field.value) {
			return '<h5><span class="badge bg-primary">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'created_by' && field.value) {
			return '<h5><span class="badge bg-success">' + field.display_text + ' ' + item.created_by_last_name.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'status_id' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'submitted_by' && field.value) {
			return '<h5><span class="badge bg-warning">' + field.display_text + ' ' + item.submitted_by_last_name.display_text + '</span></h5>';
		}
	}
	
	function on_field_changed(field, lookup_item) {
		let item = field.owner;
		
		if (field.field_name ==='supplier_id') {
			if (field.value) {
				item.post();
				item.apply();
				item.edit();
				item.refresh_record();
				
				item.supplier_id.read_only = true;
			}
		}
	}
	
	function on_filter_form_shown(item) {
		item.filter_form.find('input.approved_date, input.creation_date, input.expected_date, input.submitted_date, input.payment_date').parent().width(200);
		item.filter_form.find('input.payment_method').width(150);
	}
	
	function on_after_delete(item) {
		if (item.selections.length > 0) {
			item.selections = [];
		}
	}
	
	function on_field_get_text(field) {
		let item = field.owner;
		
		if (item.edit_form) {
			if (field.field_name === 'created_by' && field.value) {
				return field.display_text + ' ' + item.created_by_last_name.display_text;
			}
			
			if (field.field_name === 'submitted_by' && field.value) {
				return field.display_text + ' ' + item.submitted_by_last_name.display_text;
			}
			
			if (field.field_name === 'approved_by' && field.value) {
				return field.display_text + ' ' + item.approved_by_last_name.display_text;
			}
		}
	}
	
	function submitt_po(item) {
		if (item.purchase_order_details.rec_count) {
			item.question('Do you want to submitt PO?',
				function () {
					item.status_id.value = 1;
					item.submitted_by.value = task.user_info.user_id;
					item.submitted_by.lookup_value = task.user_info.user_name;
					item.submitted_date.value = new Date();
					item.apply_record();
					task.create_toast_notification('PO is submitted!', 'success');
					item.server('submitt_po_notification', [item.purchase_order_id.value]);
				}
			)
		}   else {
			task.create_toast_notification('Purchase order must have details to be submitted!', 'error');
		}
	}
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_view_form_created = on_view_form_created;
	this.pump_po_data = pump_po_data;
	this.to_approve = to_approve;
	this.approve_po_single = approve_po_single;
	this.approve_po_multiple = approve_po_multiple;
	this.cancel_po = cancel_po;
	this.on_field_get_html = on_field_get_html;
	this.on_field_changed = on_field_changed;
	this.on_filter_form_shown = on_filter_form_shown;
	this.on_after_delete = on_after_delete;
	this.on_field_get_text = on_field_get_text;
	this.submitt_po = submitt_po;
}

task.events.events28 = new Events28();

function Events30() { // northwind_traders.authentication.change_password 

	function on_edit_form_created(item) {
		//bind buttons to stuff
		item.edit_form.find("#ok-btn").off('click.task').on('click', function() {
			change_password(item);
		});
	}
	
	
	function on_edit_form_shown(item) {
	// the original below "var divcode" was moved to index.html	
	// see https://groups.google.com/g/jam-py/c/pAAdadXRSg8
		
	// divcode holds the empty div for the password meter
	// plus the informational message about picking strong passwords
	//	var divcode =
	//	`<div id="new_password_strength_meter" class="col-md-10 col-md-offset-2"></div>
	//	<div>Your password needs to be strong; a wide-range of letters, numbers and symbols, or long passwords will achieve this.  Passwords with more than 80 bits of entropy should meet this requirement.</div>`;
	// makes text boxes password boxes   
		$('input.old_password').prop("type", "password");  
		$('input.new_password').prop("type", "password");
	   
	//below is not needed after moving to index.html
		// $('input.new_password').after(divcode);
	   
		var max = 140;  // lots of entropy in password
		$('#meter1').entropizer({ target: 'input.new_password' });
	}
	
	
	function change_password(item) {
		item.post();
		item.server('change_password', [item.old_password.value, item.new_password.value], function(res) {
			if (res === 'changed') {
				item.alert_success('Password has been changed successfully!');
				item.close_edit_form();
			}
			else {
				item.alert_error(res);	
				item.edit();
			}
		});
	}
	
	function on_field_changed(field, lookup_item) {
		var item = field.owner;
		var oldPassError = $('<div id="oldpassworderror" style="margin-left: 180px; margin-bottom: 12px;">Old password entered incorrectly.</div>');
		if (field.field_name === 'old_password') {
			$('#oldpassworderror').hide();
			item.server('check_old_password', [field.value], function(error) {
				if (error) {
					item.alert_error(error);
					oldPassError.insertAfter('div.control-group:nth-child(1)');
				   
				}
			});
		}
	}
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_shown = on_edit_form_shown;
	this.change_password = change_password;
	this.on_field_changed = on_field_changed;
}

task.events.events30 = new Events30();

function Events32() { // northwind_traders.analytics.dashboard 

	function on_view_form_created(item) {
		show_orders(item, item.view_form.find('#orders-canvas').get(0).getContext('2d'));
		show_categories(item, item.view_form.find('#categories-canvas').get(0).getContext('2d'));
	}
	
	function show_orders(item, ctx) {
		var ord = item.task.purchase_order_details.copy({handlers: false});
		ord.open(
			{
				fields: [ 'product_id', 'quantity'], 
				funcs: {quantity: 'sum'},
				group_by: ['product_id'],
				order_by: ['-quantity'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.product_id.display_text);
					data.push(i.quantity.value.toFixed(2));
					colors.push(lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				ord.first();
				ord.product_id.field_caption = 'Orders';			
				draw_chart(item, ctx, labels, data, colors, '10 Biggest PO');
				ord.create_table(item.view_form.find('#orders-table'), 
					{row_count: 10, dblclick_edit: false});						
			}
		);
		// console.log(ord);
		return ord;
	}
	
	function show_categories(item, ctx) {
		var acc = item.task.order_details.copy({handlers: false});
		acc.open(
			{
				fields: ['product_id', 'product_category', 'total_price'], 
				funcs: {'total_price': 'sum'},
				group_by: ['product_id', 'product_category'],
				order_by: ['-total_price'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				acc.each(function(i) {
					labels.push(i.product_category.display_text);
					data.push(i.total_price.value);
					colors.push(lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				acc.first();
				acc.product_category.field_caption = 'Category';
				draw_chart(item, ctx, labels, data, colors, 'PO by Product Category');
				acc.create_table(item.view_form.find('#categories-table'), 
					{fields: ['product_category', 'total_price'], row_count: 10, dblclick_edit: false});						
			}
		);
		// console.log(acc);
		return acc;
	}
	
	
	function draw_chart(item, ctx, labels, data, colors, title) {
		new Chart(ctx,{
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors
					}
				]					
			},
			options: {
				//  title: {
				//	 display: true,
				//	 fontsize: 14,
				//	 text: title
				// },
				// legend: {
				//	 position: 'bottom',
				// },
					plugins: {
					  legend: {
						 display: false,
						 position: 'top',
					  },
					title: {
						display: true,
						text: title,
					},				
				}
			}
		});
	}
	function draw_pie(item, ctx, labels, data, colors, title) {
		new Chart(ctx,{
			type: 'pie',
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors
					}
				]					
			},
			options: {
				 title: {
					display: true,
					fontsize: 14,
					text: title
				},
				legend: {
					position: 'bottom',
				},
			}
		});
	}
	
	function lighten(color, luminosity) {
		color = color.replace(/[^0-9a-f]/gi, '');
		if (color.length < 6) {
			color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
		}
		luminosity = luminosity || 0;
		var newColor = "#", c, i, black = 0, white = 255;
		for (i = 0; i < 3; i++) {
			c = parseInt(color.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
			newColor += ("00"+c).substr(c.length);
		}
		return newColor; 
	}
	this.on_view_form_created = on_view_form_created;
	this.show_orders = show_orders;
	this.show_categories = show_categories;
	this.draw_chart = draw_chart;
	this.draw_pie = draw_pie;
	this.lighten = lighten;
}

task.events.events32 = new Events32();

function Events34() { // northwind_traders.order_detail.order_details 

	function on_view_form_created(item) {
		var update_date_btn = item.add_view_button('Update null date', {image: 'icon-pencil', btn_id:'update_date_btn'});
			update_date_btn.click(function() { 
				update_od_dates(item);
			});
		
		var update_total_btn = item.add_view_button('Update null total', {type: 'success', image: 'icon-pencil', btn_id:'update_total_btn'});
			update_total_btn.click(function() { 
				update_totals(item);
			});
	}
	
	function update_od_dates(item){
		item.question('Do you want to update date_allocated field for OD?',
			function() {
				item.server('update_od_dates', function(res, error) {
					if (error) {
						item.warning(error);
					}   else {
							item.alert('Successfully updated');
							item.refresh_page(true);
						}
				});
			});
	}
	
	function update_totals(item){
		item.question('Do you want to update total field for OD?',
			function() {
				item.server('update_totals', function(res, error) {
					if (error) {
						item.warning(error);
					}   else {
							item.alert('Successfully updated');
							item.refresh_page(true);
						}
				});
			});
	}
	
	function on_edit_form_shown(item) {
		//if  ($(window).width() > 480) {
		if (item.master) {
			item.edit_form.find('input.unit_price, input.quantity, input.discount').parent().width(80);
		}
		//}
	}
	this.on_view_form_created = on_view_form_created;
	this.update_od_dates = update_od_dates;
	this.update_totals = update_totals;
	this.on_edit_form_shown = on_edit_form_shown;
}

task.events.events34 = new Events34();

function Events35() { // northwind_traders.orders_menu.orders.order_details 

	function on_field_changed(field, lookup_item) {
		let item = field.owner;
		
		if (field.field_name ==='product_id') {
			if (field.value) {
				item.unit_price.value = lookup_item.standard_cost.value;
			}   else {
				item.status_id.value = null;
				item.quantity.value = null;
				item.unit_price.value = 0;
				item.discount.value = 0;
				item.total_price.value = 0;
				item.edit_form.find('#product_stock_info, #purchase_order_btn').hide();
			}
		}
		
		if (field.field_name ==='quantity') {
			if (field.value) {
				calc(item);
				
				let product_inv_data = item.server('check_product', [item.product_id.value]);
				
				if (product_inv_data.quantity_on_hold > 0) {
					if (field.value <= product_inv_data.quantity_on_hold) {
						item.status_id.value = 1;
						item.status_id.lookup_value = 'Allocated';
						item.edit_form.find('#product_stock_info').show().html('Product is allocated with: <b>'+ product_inv_data.quantity_on_hold + '</b> quantity on hold!');
						create_inv_trans(item);
					}
					
					else if(field.value > product_inv_data.quantity_on_hold) {
						item.status_id.value = 5;
						item.status_id.lookup_value = 'No Stock';
						item.edit_form.find('#product_stock_info').show().html('Available quantity: <b>' + product_inv_data.quantity_on_hold + '</b>.<br> Product has insufficient inventory, you need to create a purchase order!');
						item.edit_form.find('#purchase_order_btn').show();
					}
					else {
						item.status_id.value = 5;
						item.status_id.lookup_value = 'No Stock';
						item.edit_form.find('#product_stock_info').show().html('Available quantity: <b>' + product_inv_data.quantity_on_hold + '</b>.<br> Product has insufficient inventory, you need to create a purchase order!');
						item.edit_form.find('#purchase_order_btn').show();
					}
					
				}
				
				else if (product_inv_data.quantity_on_hold === 0) {
					item.status_id.value = 5;
					item.status_id.lookup_value = 'No Stock';
					item.edit_form.find('#product_stock_info').show().append('Available quantity: <b>' + product_inv_data.quantity_on_hold + '</b>.<br> Product has insufficient inventory, you need to create a purchase order!');
					item.edit_form.find('#purchase_order_btn').show();
				}
			}
			
			if (field.value === 0) {
				item.status_id.value = null;
				item.quantity.value = null;
				item.total_price.value = 0;
				item.edit_form.find('#product_stock_info, #purchase_order_btn').hide();
			}
		}
		
		if (field.field_name === 'discount' && field.value) {
			calc(item);
		}
		
	}
	
	function on_field_validate(field) {
		if (field.field_name === 'discount' && field.value > 20|| field.value < 0) {
			return 'The amount cant be more then 20% or negative!';
		}
	}
	function calc(item) {
		let sum;
			sum = item.round(item.unit_price.value * item.quantity.value, 2);
			item.total_price.value = item.round(sum - (sum*item.discount.value/100), 2);
	}
	
	function on_edit_form_shown(item) {
		item.edit_form.find('input.unit_price, input.quantity, input.discount, input.total_price').parent().width(120);
		item.edit_form.find('input.purchase_order_id, input.status_id, input.inventory_id').parent().width(300);
	}
	
	function on_field_get_html(field) {
		if (field.field_name === 'product_id' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'status_id' && field.value) {
			return '<h5><span class="badge bg-success">' + field.display_text + '</span></h5>';
		}
	}
	
	function on_field_select_value(field, lookup_item) {
		if (field.field_name === 'product_id' && lookup_item) {
			lookup_item.view_options.fields = ['id', 'product_name', 'category', 'standard_cost', 'list_price', 'quantity_per_unit', 'discontinued'];
		}
	}
	
	function on_edit_form_created(item) {
		let purchase_order_btn = item.add_edit_button('Create purchae order', {type: 'success', image: 'bi bi-cart-check', btn_id: 'purchase_order_btn'});
			purchase_order_btn.click(function(e) {
				if (!item.purchase_order_id.value) {
					item.question('Do you wanto to create Purchase order?',
						function() {
							item.master.edit();
							item.master.apply();
							item.master.refresh_record();
							create_po(item, item.order_id.value, item.id.value, item.quantity.value, item.product_id.value);
						}
					);
				}   else {
					e.preventDefault();
					po_edit(item);
				}
			});
			
		if (item.is_new()) {
			item.edit_options.title = 'New order detail entry';
			item.product_id.read_only = false;
			item.edit_form.find('#product_stock_info, #purchase_order_btn').hide();
		}   else {
			item.edit_options.title = 'Preview for order detail #' + item.id.value;
			item.product_id.read_only = true;
			item.edit_form.find('#product_stock_info').hide();
			
			if (item.purchase_order_id.value) {
				item.edit_form.find('#purchase_order_btn').show().html('<i class="bi bi-cart-check"></i>&nbsp; View PO');
			}
		}
		
		item.create_inputs(item.edit_form.find("#product_div"), {
			fields: ['product_id', 'quantity'], in_well: false
		});
		
		item.create_inputs(item.edit_form.find("#fields_div"), {
			fields: ['unit_price', 'discount', 'total_price', 'status_id', 'purchase_order_id', 'inventory_id'], in_well: false
		});
	}
	
	function create_po(item, order_id, id, quantity, product_id) {
		item.server('create_po', [order_id, id, quantity, product_id], function (res, error) {
			if (error) {
				item.warning(error);
			}   else {
				item.master.refresh_record();
				item.warning('Purchase order #' + item.purchase_order_id.value + ' is succesfully created!');
				item.edit_form.find('#purchase_order_btn').show().html('<i class="bi bi-cart-check"></i>&nbsp; View PO');
			}
		});
	}
	
	function po_edit(item) {
		let po = task.purchase_orders.copy();
			po.set_where({purchase_order_id: item.purchase_order_id.value});
			po.open(function(i) {
				i.on_edit_form_closed = function (c) {
					console.log('Test');
					item.master.refresh_record();
					item.edit();
				};
				i.edit_record();
			});
	}
	
	function create_inv_trans(item) {
		item.master.edit();
		item.master.apply();
		item.master.refresh_record();
		
		let inv_trans = task.inventory_transactions.copy({handlers: false});
			inv_trans.open({open_empty: true});
			inv_trans.append();
					
			inv_trans.transaction_type.value = 1;   //purchased
			inv_trans.product_id.value = item.product_id.value;
			inv_trans.customer_order_id.value = item.master.order_id.value;
			inv_trans.quantity.value = item.quantity.value;
			inv_trans.transaction_created_date.value = new Date();
			inv_trans.post();
			inv_trans.apply();
			
			item.edit();
			item.inventory_id.value = inv_trans.transaction_id.value;
			item.master.edit();
			item.master.apply();
			item.master.edit();
			item.edit();
			item.master.refresh_record();
	}
	
	function on_view_form_created(item) {
		//custom delete check
		item.view_form.find("#delete-btn").off('click.task').on('click', function(e) {
			e.preventDefault();
			
			if (item.purchase_order_id.value) {
				item.warning('This order detail has Purchase order!');
				item.abort();
			}
			
			else if (item.inventory_id.value) {
				item.warning('This order detail has Inventory transaction');
				item.abort();
			}   else {
					item.delete_record();
				}
		});
	}
	this.on_field_changed = on_field_changed;
	this.on_field_validate = on_field_validate;
	this.calc = calc;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_field_get_html = on_field_get_html;
	this.on_field_select_value = on_field_select_value;
	this.on_edit_form_created = on_edit_form_created;
	this.create_po = create_po;
	this.po_edit = po_edit;
	this.create_inv_trans = create_inv_trans;
	this.on_view_form_created = on_view_form_created;
}

task.events.events35 = new Events35();

function Events36() { // northwind_traders.inventory_menu.inventory_list 

	let filtered_item;
	
	function on_view_form_created(item) {
		//item.paginate = false;
	
		//purchase
		// item.view_form.find("#purchase_btn").click(function(e) {
		//	 purchase(item);
		// });
		item.view_form.find("#purchase_btn").click(function(e) {
				item.alert('Cannot be used on Demo! Uncomment code in Task/Inv. List line 6');
		});
	
		
		//filter to reorder
		item.view_form.find("#filter_inv_to_reoder_btn").click(function(e) {
			item.selections = [];
			item.filtered = !item.filtered;
			if (item.filtered) {
				task.create_toast_notification('Displaying products for reorder. Click again to show all products in inventory!', 'success');
			}   else {
				task.create_toast_notification('All products are shown now!', 'success');
			}
		});
		
		//export xlsx
		item.view_form.find("#export_inventory_btn").click(function(e) {
			export_inventory(item);
		});
			
		filtered_item = item;
		item.selections = [];
		item.filtered = false;
	}
	
	function on_filter_record(item) {
		if (item.quantity_on_hand.value <= 0) {
			return true;
		}
	}
	
	function on_after_open(item) {
		let product_id = [];
		item.server('get_records', [product_id], function(records) {
			item.disable_controls();
			try {
				records.forEach(function(rec) {
					item.append();
					item.id.value = rec.product_id;			
					item.product_name.value = rec.product_name;
					item.target_level.value = rec.target_level;
					item.quantity_on_hold.value = rec.quantity_on_hold;
					item.quantity_on_order.value = rec.quantity_on_order;
					item.quantity_on_back_order.value = rec.quantity_on_back_order;
					item.quantity_on_hand.value = rec.quantity_on_hand;
					item.quantity_purchased.value = rec.quantity_purchased;			
					item.quantity_sold.value = rec.quantity_sold;			
					item.post();
				});
				item.first();
			}
			finally {
				item.enable_controls();
			}
		});
	}
	
	function on_edit_form_created(item) {
		var title = 'Purchase ';
		item.edit_options.title = title;
		item.edit_form.find('#ok-btn')
			.text('Purchase')
			.off('click.task')
			.on('click', function() {
				purchase(item);
			});
	}
	function on_field_get_html(field) {
		let item = field.owner;
		
		if (field.field_name === 'product_name' && field.value) {
			return '<h5><span class="badge bg-primary">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'quantity_on_hand') {
			let color = 'green';
			if (item.quantity_on_hand.value < 30) {
				color = 'red';
			}
			return '<span style="color: ' + color + ';">' + field.display_text + '</span>';
		}
		if (field.field_name === 'quantity_on_hold') {
			let color;
			if (item.quantity_on_hold.value > 0) {
				color = 'green';
			}
			return '<span style="color: ' + color + ';">' + field.display_text + '</span>';
		}
	}
	
	function purchase(item){
		let selections = item.selections;
		
			if (item.selections.length === 0) {
				selections = [item.id.value];
			}
			
		item.question('Do you want to crete Purchase orders for ' + selections.length + ' products?',
			function() {
				item.server('create_po', [selections], function (res, error) {
					if (error) {
						item.warning(error);
					}   else {
						item.selections = [];
						item.refresh();
						create_toast_notification('PO successfully created!', 'success');
					}
				});
			}
		);
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('#add_columns_btn, #new-btn, #edit-btn, #delete-btn').hide();
	}
	
	function export_inventory(item) {
		let selections = item.selections;
		
			if (item.selections.length === 0) {
				selections = [item.id.value];
			}
		
		item.question('Do you want to export ' + selections.length + ' rows?',
			function() {
				let file_name = item.server('export_inventory', [item.dataset, selections]),
					url = [location.protocol, '//', location.host, location.pathname].join('');
					url += file_name;
					window.open(encodeURI(url));
			}
		);
	}
	
	function on_field_get_summary(field, value) {
		let item = field.owner;
		
		if (field.field_name === 'product_name') {
			return item.rec_count;
		}
	}
	this.on_view_form_created = on_view_form_created;
	this.on_filter_record = on_filter_record;
	this.on_after_open = on_after_open;
	this.on_edit_form_created = on_edit_form_created;
	this.on_field_get_html = on_field_get_html;
	this.purchase = purchase;
	this.on_view_form_shown = on_view_form_shown;
	this.export_inventory = export_inventory;
	this.on_field_get_summary = on_field_get_summary;
}

task.events.events36 = new Events36();

function Events38() { // northwind_traders.po_detail.purchase_order_details 

	function on_view_form_created(item) {
		var update_date_btn = item.add_view_button('Update received date', {image: 'icon-pencil', btn_id:'update_date_btn'});
			update_date_btn.click(function() { 
				update_od_dates(item);
			});
		
	}
	
	function update_od_dates(item){
		item.question('Do you want to update date_received field for PO?',
			function() {
				item.server('update_od_dates', function(res, error) {
					if (error) {
						item.warning(error);
					}   else {
							item.alert('Successfully updated');
							item.refresh_page(true);
						}
				});
			});
	}
	this.on_view_form_created = on_view_form_created;
	this.update_od_dates = update_od_dates;
}

task.events.events38 = new Events38();

function Events39() { // northwind_traders.inventory_menu.purchase_orders.purchase_order_details 

	function on_field_changed(field, lookup_item) {
		let item = field.owner;
		
		if (field.field_name ==='product_id' && lookup_item) {
			item.unit_cost.value = lookup_item.standard_cost.value;
			item.quantity.value = lookup_item.minimum_reorder_quantity.value;
		}
		
		if (field.field_name ==='quantity' && field.value) {
			item.total_price.value = field.value * item.unit_cost.value;
		}
	}
	
	function on_edit_form_created(item) {
		item.inventory_id.read_only = true;
		item.posted_to_inventory.read_only = true;
	
		if (item.is_new()) {
			item.edit_options.title = 'New purchase order detail - ' + item.master.supplier_id.display_text;
		}   else {
			item.edit_options.title = 'Edit purchase order detail - ' + item.master.supplier_id.display_text;
			item.product_id.read_only = true;
		}
		
		item.add_edit_button('Recive PO', {type: 'success', image: 'bi bi-house-check', btn_id: 'recive_po_btn'}).click(function() {
			recive_po(item);
		});
	}
	
	function on_view_form_created(item) {
		if (item.owner.status_id.value >= 2) {
			item.table_options.editable_fields = [];
		}   else {
			item.table_options.editable_fields = ['quantity'];
		}
		
		item.view_form.find("#new-btn").off('click.task').on('click', function(e) {
			e.preventDefault();
			
			if (item.master.purchase_order_id.value > 0) {
				item.append_record();
			}   else {
				item.warning('First save Purchase order!');
			}
		});
	}
	
	function recive_po(item) {
		item.edit();
		item.date_received.value = new Date();
		item.posted_to_inventory.value = true;
		item.master.edit();
		item.master.apply();
		item.master.edit();
		item.master.refresh_record();
		item.edit();
		task.create_toast_notification('Purchase order recived!', 'success');
		create_inv_trans(item);
		item.edit_form.find('#recive_po_btn').hide();
	}
	
	function create_inv_trans(item) {
		let inv_trans = task.inventory_transactions.copy({handlers: false});
			inv_trans.open({open_empty: true});
			inv_trans.append();
					
			inv_trans.transaction_type.value = 1;   //purchased
			inv_trans.product_id.value = item.product_id.value;
			inv_trans.purchase_order_id.value = item.owner.purchase_order_id.value;
			inv_trans.quantity.value = item.quantity.value;
			inv_trans.transaction_created_date.value = new Date();
			inv_trans.post();
			inv_trans.apply();
			
			item.edit();
			item.inventory_id.value = inv_trans.transaction_id.value;
			item.master.edit();
			item.master.apply();
			item.master.refresh_record();
			item.edit();
			task.create_toast_notification('Product successfully posted to inventory #' + item.inventory_id.value + '!', 'success');
			
			//check if po have buounded order
			let order_details_check = task.order_details.copy({handlers: false});
				order_details_check.set_where({purchase_order_id: item.purchase_order_id.value});
				order_details_check.open();
					
				if (order_details_check.rec_count) {
					item.question('There are orders with this product on back order. Would you like to fill them now?',
						function() {
							item.server('update_order', [item.inventory_id.value, item.product_id.value, item.purchase_order_id.value], function(res, error) {
								if (error) {
									task.create_toast_notification(error, 'error'); 
								}   else {
									task.create_toast_notification('Back ordered product filled for Order #' + order_details_check.order_id.value, 'success');
								}
							});
						}
					);
				}
	}
	
	function on_edit_form_shown(item) {
		item.edit_form.find('input.date_received, input.inventory_id').parent().width(200);
		item.edit_form.find('input.unit_cost, input.quantity, input.total_price').width(80);
		
		if (item.owner.status_id.value == 1) {
			item.edit_form.find("#recive_po_btn").hide();
		}
		
		if (item.owner.status_id.value >= 2) {
			item.quantity.read_only = true;
			item.unit_cost.read_only = true;
			item.total_price.read_only = true;
			item.product_id.read_only = true;
		}
		
		if (item.owner.status_id.value == 1) {
			item.edit_form.find("#recive_po_btn").hide();
		}
		
		if (item.posted_to_inventory.value === true) {
			item.edit_form.find("#recive_po_btn").hide();
			item.date_received.read_only = true;
		}
	}
	
	function on_field_select_value(field, lookup_item) {
		let item = field.owner;
		
		if (field.field_name === 'product_id' && lookup_item) {
			lookup_item.set_where({supplier_ids: item.owner.supplier_id.value});
		}
	}
	
	function on_field_get_html(field) {
		if (field.field_name === 'product_id' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'posted_to_inventory' && field.value) {
			return '<i class="bi bi-check2-square"></i>';
		}
	}
	this.on_field_changed = on_field_changed;
	this.on_edit_form_created = on_edit_form_created;
	this.on_view_form_created = on_view_form_created;
	this.recive_po = recive_po;
	this.create_inv_trans = create_inv_trans;
	this.on_edit_form_shown = on_edit_form_shown;
	this.on_field_select_value = on_field_select_value;
	this.on_field_get_html = on_field_get_html;
}

task.events.events39 = new Events39();

function Events41() { // northwind_traders.reports.inventory_list_jam 

	function on_before_print_report(report) {
		report.alert('Not yet implemented!');
	}
	this.on_before_print_report = on_before_print_report;
}

task.events.events41 = new Events41();

function Events42() { // northwind_traders.inventory_menu.inventory_list_datatables 

	function on_view_form_created(item) {
		item.paginate = false;
		item.table_options.new = false;
		if (!item.lookup_field) {	
			var purchase_btn = item.add_view_button('Purchase', {image: 'icon-pencil', btn_id:'purchase_btn'});
				purchase_btn.click(function() { 
					purchase(item);
				});
		}
		
		item.view_form.find("#new-btn, #edit-btn, #delete-btn").hide();
	}
	
	function on_after_open(item) {
		item.server('get_rows', function(data, error) {
				var table=$('#table_id').DataTable( {
					data: data,
					columns: [
								{data: 'product_id', title: 'product_id'},
								{data: 'product_name', title: 'product_name'},
								{data: 'quantity_on_back_order', title: 'quantity_on_back_order'},
								{data: 'quantity_purchased', title: 'quantity_purchased'},
								{data: 'quantity_on_hand', title: 'quantity_on_hand'},
								{data: 'quantity_sold', title: 'quantity_sold'},
								{data: 'quantity_on_hold', title: 'quantity_on_hold'},
								{data: 'quantity_on_order', title: 'quantity_on_order'},
								{data: 'target_level', title: 'target_level'}
							],
					columnDefs: [ {
						orderable: false,
						className: 'select-checkbox',
						targets:   0
					} ],
					// select: {
					//	 style:	'os',
					//	 selector: 'td:first-child'
					// },
					// order: [[ 0, 'asc' ]]
					select: {
						style: 'multi'
					}
				} );
				// console.table(data);
		});
		
	}
	this.on_view_form_created = on_view_form_created;
	this.on_after_open = on_after_open;
}

task.events.events42 = new Events42();

function Events43() { // northwind_traders.catalogs.mail 

	function on_edit_form_created(item) {
		item.edit_form.find('#ok-btn').text('Send email').off('click.task').on('click', function() {
			send_email_server(item);
		});
		item.edit_form.find('textarea.mess').height(120);
	}
	
	function send_email_server(item, email_address, subject, mess) {
		item.server('send_email_server', [item.email_address.value, item.subject.value, item.mess.value], 
			function(result, err) {
				if (err) {
					item.warning('Failed to send the mail: ' + err);
					item.edit();
				}
				else {
					item.warning('Successfully sent the mail');
					item.close_edit_form();
					item.delete();			
				}
			}
		);
	}
	this.on_edit_form_created = on_edit_form_created;
	this.send_email_server = send_email_server;
}

task.events.events43 = new Events43();

function Events44() { // northwind_traders.catalogs.home_page 

	function on_view_form_created(item) {
		item.view_form.find('#home_page_tabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
		
		//orders open
		item.view_form.find("#orders").on('click.task', function(e) {
			e.preventDefault();
			task.orders.view(task.forms_container);
		});
		
		//invoices open
		item.view_form.find("#invoices").on('click.task', function(e) {
			e.preventDefault();
			task.invoices.view(task.forms_container);
		});
		
		//customers open
		item.view_form.find("#customers").on('click.task', function(e) {
			e.preventDefault();
			task.customers.view(task.forms_container);
		});
		
		//inventory open
		item.view_form.find("#inventory").on('click.task', function(e) {
			e.preventDefault();
			task.inventory_list.view(task.forms_container);
		});
		
		//purchase_orders open
		item.view_form.find("#purchase_orders").on('click.task', function(e) {
			e.preventDefault();
			task.purchase_orders.view(task.forms_container);
		});
		
		//inventory transactions open
		item.view_form.find("#inventory_transactions").on('click.task', function(e) {
			e.preventDefault();
			task.inventory_transactions.view(task.forms_container);
		});
		
		//products open
		item.view_form.find("#products").on('click.task', function(e) {
			e.preventDefault();
			task.products.view(task.forms_container);
		});
		
		//suppliers open
		item.view_form.find("#suppliers").on('click.task', function(e) {
			e.preventDefault();
			task.suppliers.view(task.forms_container);
		});
		
		//employees open
		item.view_form.find("#employees").on('click.task', function(e) {
			e.preventDefault();
			task.employees.view(task.forms_container);
		});
		
		//shippers open
		item.view_form.find("#shippers").on('click.task', function(e) {
			e.preventDefault();
			task.shippers.view(task.forms_container);
		});
		
		//sales_reports open
		item.view_form.find("#sales_reports").on('click.task', function(e) {
			e.preventDefault();
			task.pivot_table.view(task.forms_container);
		});
		
		//customers_report open
		item.view_form.find("#customers_reports").on('click.task', function(e) {
			e.preventDefault();
			task.customers_stats.view(task.forms_container);
		});
		
		//shipers_report open
		item.view_form.find("#shippers_reports").on('click.task', function(e) {
			e.preventDefault();
			task.shippment.view(task.forms_container);
		});
		
		//instructions open
		item.view_form.find("#app_instructions").on('click.task', function(e) {
			e.preventDefault();
			how_app_works_mess(item);
		});
		
		let active_orders = task.orders.copy();
			//if manager
			if (task.user_info.user_id == 1) {
				active_orders.set_where({status_id__ne: 3}); //not closed
			}   else {
				active_orders.set_where({employee_id: task.user_info.user_id, status_id__ne: 3}); //not closed
			}
			active_orders.set_order_by(['-order_date']);
			active_orders.table_options.height = 600;
			active_orders.paginate = false;
			active_orders.table_options.show_paginator = false;
			active_orders.table_options.fields = ['order_id', 'customer_id', 'employee_id', 'order_date', 'shipper_id', 'status_id'];
			active_orders.table_options.expand_selected_row = 2;
			active_orders.table_options.multiselect = false;
			active_orders.set_order_by(['order_id']);
			active_orders.open();
			active_orders.create_table(item.view_form.find(".active_orders"));
			
		let inventory = task.inventory_list.copy();	
			inventory.table_options.height = 600;
			inventory.table_options.fields = ['id', 'product_name', 'quantity_on_hand', 'target_level'];
			inventory.table_options.expand_selected_row = 2;
			inventory.table_options.multiselect = false;
			inventory.open();
			inventory.create_table(item.view_form.find(".inventory_to_reorder"));
			
		task.dashboard.show_orders(item, item.view_form.find('#orders-canvas').get(0).getContext('2d'));
		task.dashboard.show_categories(item, item.view_form.find('#categories-canvas').get(0).getContext('2d'));
	
	}
	
	function how_app_works_mess(item) {
		task.message(
			'<h5>Hi there!</h5>'+
			'   <p>This is the Northwind Traders v1 Application migrated from Access semi automatically. Please visit Help pages for the migration process.'+
			'   <p>Use Export to download the code and the database.'+
			'	   Then, install Jam.py, start New project and import the file, as described on Help.'+
			'	   Some of the Forms were left as default Jam.py view, ie. Customers, Suppliers, Shippers. Takes a minute to customise, all no code!</p><hr>'+
			'   <p>Added RFM Analysis from <a href="https://dev.to/suresh_sonwane/rfm-analysis-in-python-simplified-42ed">here!</a></p><hr>'+
			'	   Added Pivot Table JS plugin. The video how to use it is <a href="https://youtu.be/2Vg399Ewb20">here!</a></p><hr>'+
			''+
			'   <p>Enjoy Jam.py!</p>',
				{title: 'App message...', margin: 0, text_center: false,
					buttons: {"OK": undefined}, center_buttons: true}
				);
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('#add_columns_btn').hide();
	}
	this.on_view_form_created = on_view_form_created;
	this.how_app_works_mess = how_app_works_mess;
	this.on_view_form_shown = on_view_form_shown;
}

task.events.events44 = new Events44();

function Events45() { // northwind_traders.reports.yearly_sales 

	function on_param_form_created( report ) {
		var now = new Date();
		if (!report.date_from.value) {
			// report.date_from.value = new Date(now.getFullYear() - 17, now.getMonth() - 6, now.getDate());
			const d = new Date();
			d.setFullYear(2006,1,1);
			report.date_from.value = d;
			report.date_to.value = now;
		}
	}
	this.on_param_form_created = on_param_form_created;
}

task.events.events45 = new Events45();

function Events46() { // northwind_traders.reports.invoice 

	function on_param_form_shown(report) {
		report.param_form.find('input.order_id').width(60);
	}
	
	function on_param_form_created(report) {
		report.order_id.read_only = true;
	}
	
	function on_open_report(report, url) {
		report.param_form.find("#report_sppiner").hide();
		window.open(url);
	}
	this.on_param_form_shown = on_param_form_shown;
	this.on_param_form_created = on_param_form_created;
	this.on_open_report = on_open_report;
}

task.events.events46 = new Events46();

function Events47() { // northwind_traders.analytics.shippment 

	function on_view_form_created(item) {
		show_orders(item, item.view_form.find('#orders-canvas').get(0).getContext('2d'));
		show_categories(item, item.view_form.find('#categories-canvas').get(0).getContext('2d'));
	}
	
	function show_orders(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: [ 'shipper_id', 'shipping_fee'], 
				funcs: {shipping_fee: 'sum', order_id: 'sum'},
				group_by: ['shipper_id'],
				order_by: ['-shipping_fee'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.shipper_id.display_text);
					data.push(i.shipping_fee.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				ord.first();
				// ord.shipper_id.field_caption = 'Shipping ID';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Biggest shippments');
				ord.create_table(item.view_form.find('#orders-table'), 
					{row_count: 10, dblclick_edit: false});						
			}
		);
		return ord;
	}
	
	function show_categories(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: ['shipping_fee', 'ship_state_province'], 
				funcs: {shipping_fee: 'sum'},
				group_by: ['ship_state_province'],
				order_by: ['-shipping_fee'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.ship_state_province.display_text);
					data.push(i.shipping_fee.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				ord.first();
				// ord.shipper_id.field_caption = 'Shipping ID';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Biggest shippments');
				ord.create_table(item.view_form.find('#categories-table'), 
					{row_count: 10, dblclick_edit: false});						
			}
		);
		return ord;
	}
	this.on_view_form_created = on_view_form_created;
	this.show_orders = show_orders;
	this.show_categories = show_categories;
}

task.events.events47 = new Events47();

function Events48() { // northwind_traders.analytics.customers_stats 

	function on_view_form_created(item) {
		show_orders(item, item.view_form.find('#orders-canvas').get(0).getContext('2d'));
		show_categories(item, item.view_form.find('#categories-canvas').get(0).getContext('2d'));
	}
	
	function show_orders(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: ['customer_id', 'shipping_fee'], 
				funcs: {shipping_fee: 'sum'},
				group_by: ['customer_id'],
				order_by: ['-shipping_fee'],
				limit: 8
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.customer_id.display_text);
					data.push(i.shipping_fee.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 8));
				});
				ord.first();
				// ord.shipper_id.field_caption = 'Shipping ID';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Shipping fee across Customers');
				ord.create_table(item.view_form.find('#orders-table'), 
					{row_count: 8, dblclick_edit: false});						
			}
		);
		return ord;
	}
	
	function show_categories(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: ['order_id', 'customer_id'], 
				funcs: {order_id: 'count'},
				group_by: ['customer_id'],
				order_by: ['-order_id'],
				limit: 8
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.customer_id.display_text);
					data.push(i.order_id.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 8));
				});
				ord.first();
				// ord.order_id.field_caption = 'Order Quantity';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Order quantity across Customers');
				ord.create_table(item.view_form.find('#categories-table'), 
					{fields: ['customer_id', 'order_id'], row_count: 8, dblclick_edit: false});						
			}
		);
		return ord;
	}
	this.on_view_form_created = on_view_form_created;
	this.show_orders = show_orders;
	this.show_categories = show_categories;
}

task.events.events48 = new Events48();

function Events49() { // northwind_traders.analytics.employees_stats 

	function on_view_form_created(item) {
		show_orders(item, item.view_form.find('#orders-canvas').get(0).getContext('2d'));
		show_categories(item, item.view_form.find('#categories-canvas').get(0).getContext('2d'));
	}
	
	function show_orders(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: ['order_id', 'employee_id'], 
				funcs: {order_id: 'count'},
				group_by: ['employee_id'],
				order_by: ['-order_id'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.employee_id.display_text);
					data.push(i.order_id.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				ord.first();
				ord.order_id.field_caption = 'Order Quantity';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Orders generation by Employees');
				ord.create_table(item.view_form.find('#orders-table'), 
					{fields: ['employee_id', 'order_id'], row_count: 10, dblclick_edit: false});						
			}
		);
		return ord;
	}
	
	function show_categories(item, ctx) {
		var ord = item.task.orders.copy({handlers: false});
		ord.open(
			{
				fields: ['order_id', 'ship_state_province'], 
				funcs: {order_id: 'count'},
				group_by: ['ship_state_province'],
				order_by: ['-order_id'],
				limit: 10
			}, 
			function() {
				var labels = [],
					data = [],
					colors = [];
				ord.each(function(i) {
					labels.push(i.ship_state_province.display_text);
					data.push(i.order_id.value.toFixed(2));
					colors.push(task.dashboard.lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				ord.first();
				ord.order_id.field_caption = 'Order Quantity';			
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Order quantity across States');
				ord.create_table(item.view_form.find('#categories-table'), 
					{fields: ['ship_state_province', 'order_id'], row_count: 10, dblclick_edit: false});						
			}
		);
		return ord;
	}
	
	
	
	function show_tracks(item, ctx) {
		var tracks = item.task.tracks.copy({handlers: false});
		tracks.open(
			{
				fields: ['name', 'tracks_sold'], 
				order_by: ['-tracks_sold'],
				limit: 10
			}, 
			
			function() {
				var labels = [],
					data = [],
					colors = [];
				tracks.each(function(t) {
					labels.push(t.name.display_text);
					data.push(t.tracks_sold.value);
					colors.push(task.dashboard.lighten('#196619', (t.rec_no - 1) / 10));
				});
				tracks.first();
				tracks.name.field_caption = 'Track';
				task.dashboard.draw_chart(item, ctx, labels, data, colors, 'Ten most popular tracks');
				tracks.create_table(item.view_form.find('#tracks-table'), 
					{row_count: 10, dblclick_edit: false});
			}
		);
		return tracks;
	}
	this.on_view_form_created = on_view_form_created;
	this.show_orders = show_orders;
	this.show_categories = show_categories;
	this.show_tracks = show_tracks;
}

task.events.events49 = new Events49();

function Events50() { // northwind_traders.analytics.rfm_analysis 

	function on_view_form_created(item) {
		item.paginate = false;
		item.table_options.new = false;
		item.view_form.find("#edit-btn").hide();
		item.view_form.find("#delete-btn").hide();
		item.view_form.find("#new-btn").hide();
		show_rfm(item, item.view_form.find('#rfm-canvas').get(0).getContext('2d'));
	
		
	}
	
	function show_rfm(item) {
		item.alert('Working! Please try again if no data!');
		item.open(function() { 
			item.server('get_chart_info', function(records) {
				item.disable_controls();
				try {
					records.forEach(function(rec) {
						item.append();
						item.id.value = rec.id;			
						item.product_id_lookup.value = rec.product_id_lookup;
						item.recency.value = rec.recency;
						item.frequency.value = rec.frequency;
						item.monetary_value.value = rec.monetary_value;
						item.r.value = rec.r;
						item.f.value = rec.f;
						item.m.value = rec.m;			
						item.rfm_score.value = rec.rfm_score;			
						item.segment.value = rec.segment;			
						item.post();
					});
					item.first();
				}
				finally {
					item.enable_controls();
					// console.table(records);
					make_base(item);
					
				}
			});
		});
		// make_base(item);
		
	}
	function make_base(item)
	{
	  var image = new Image();
	  image.src = 'static/Figure_1.png?' +new Date().getTime();
	  var canvas = item.view_form.find('#rfm-canvas').get(0).getContext('2d');
	  
	  var returning = image.onload = function(){
		canvas.drawImage(image, 0, 0);
		return canvas;
	
	  };
	}
	this.on_view_form_created = on_view_form_created;
	this.show_rfm = show_rfm;
	this.make_base = make_base;
}

task.events.events50 = new Events50();

function Events51() { // northwind_traders.analytics.pivot_table 

	function on_view_form_created(item) {
		item.alert('This will take a while with a huge database!');
		create_pivot_table(item);
	}
	
	function create_pivot_table(item) {
		let pivot = task.pivot_table.copy();
			pivot.view_options.title = 'Pivot - sales analysis';
			pivot.view(task.forms_container);
			
		let pivot_records = task.order_details.copy(),
			records = [];
			pivot_records.open();
			
			pivot_records.each(function(c) {
				records.push({
					"order_id": pivot_records.order_id.value,
					"customer": pivot_records.customer.display_text,
					"city": pivot_records.city.display_text,
					"order_date": pivot_records.order_date.display_text,
					"date_allocated": pivot_records.date_allocated.value,
					"employee": pivot_records.employee.display_text,
					"order_status": pivot_records.order_status.display_text,
					"product_id": pivot_records.product_id.display_text,
					"product_category": pivot_records.product_category.display_text,
					"shipper": pivot_records.shipper.display_text,
					"status_id": pivot_records.status_id.display_text,
					"total_price": pivot_records.total_price.value,
					"quantity": pivot_records.quantity.value,
					"quarter": get_quarter(item, pivot_records.order_date.display_text)
				});
			});
		
			var dateFormat = $.pivotUtilities.derivers.dateFormat;
			var sortAs = $.pivotUtilities.sortAs;
							
			$("#pivot").pivotUI(records, 
				{
				renderers: $.extend(
							$.pivotUtilities.renderers, 
							$.pivotUtilities.plotly_renderers,
							$.pivotUtilities.gchart_renderers, 
							$.pivotUtilities.d3_renderers
				),
				derivedAttributes: {
					"day": dateFormat("order_date", "%w", false),
					"month": dateFormat("order_date", "%n", false),
					//"month_no": (((month - 1)/3)+1).floor,
					"year": dateFormat("order_date", "%y", false)
				},
				cols: [ "year", "quarter","month"],
				rows: ["employee"],
				aggregatorName: "Sum",
				vals: ["total_price"],
				rendererName: "Heatmap",
				sorters: {
					"day": sortAs(["Mon","Tue","Wed", "Thu","Fri","Sat", "Sun"]),
					"month": sortAs(["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
				},
			});
		
		item.view_form.find("#export_pivot").click(function(e) {
			$('#pivot').tableExport({
			  type: 'excel',
			  });
		});
	}
	
	function get_quarter(item, order_date) {
		let date = new Date(order_date);
		
		return "Q" + Math.floor(date.getMonth() / 3 + 1);
	}
	this.on_view_form_created = on_view_form_created;
	this.create_pivot_table = create_pivot_table;
	this.get_quarter = get_quarter;
}

task.events.events51 = new Events51();

function Events52() { // northwind_traders.analytics.xlsx_sheet 

	function on_view_form_created(item) {
	/*var ws_name = "SheetJS";
	
	/* Create worksheet */
	/*var ws_data = [
	  [ "S", "h", "e", "e", "t", "J", "S" ],
	  [  1 ,  2 ,  3 ,  4 ,  5 ]
	];
	var ws = XLSX.utils.aoa_to_sheet(ws_data);*/
	
	/* Create workbook */
	//var wb = XLSX.utils.book_new();
	
	/* Add the worksheet to the workbook */
	//XLSX.utils.book_append_sheet(wb, ws, ws_name);
	
	/* Write to file */
	//XLSX.writeFile(wb, "SheetJS.xlsx");
	
	//var workbook = XLSX.utils.book_new();
	
	//var worksheet = XLSX.utils.aoa_to_sheet(aoa, opts);
	
	var worksheet = XLSX.utils.aoa_to_sheet([
	  ["A1", "B1", "C1"],
	  ["A2", "B2", "C2"],
	  ["A3", "B3", "C3"]
	]);
	}
	this.on_view_form_created = on_view_form_created;
}

task.events.events52 = new Events52();

function Events54() { // northwind_traders.catalogs.api_call 

	function on_view_form_created(item) {
		var api_btn = item.add_view_button('Fetch from API', {image: 'icon-pencil'});
		api_btn.click(function() { api(item) });
		item.view_form.find("#delete-btn").on('click',
			function() {
				item.alert('Can not be deleted on Demo!');
			}
		);
	}
	function api(item) {
		item.alert('Fetching!');
		item.server('send',
			function(result, err) {
				if (err) {
					item.alert_error('Failed to fetch: ' + err);
				}
				else {
					item.refresh_page(true);
					item.alert('Successfully fetched from API!');
				}
			}
		);
	
	}
	this.on_view_form_created = on_view_form_created;
	this.api = api;
}

task.events.events54 = new Events54();

function Events55() { // northwind_traders.analytics.po_chart 

	function on_view_form_created(item) {
		// item.view_options.width = 1300;
		show_purchase_order_details_data(item, item.view_form.find('#po_chart-canvas')[0].getContext('2d'));
	}
	
	//PO chart data
	function show_purchase_order_details_data(item, ctx) {
		var ecomapp_data = item.task.purchase_order_details.copy({handlers: false});
			var date;
			ecomapp_data.open({
				// where: {id__in: selections},
				fields: ['product_id', 'quantity', 'unit_cost', 'date_received'], 
				funcs: {quantity: 'sum', unit_cost: 'sum'},
				group_by: ['product_id', 'date_received'],
				order_by: ['-date_received'],
				limit: 10
				}, 
				function() {
					var data_obj,
						datasets = [];
						ecomapp_data.each(function(i) {
							
							datasets.push({
								label: i.product_id.display_text,
								data: [{
									// x: moment(i.date_received.value, "YYYY-MM-DD HH:mm:ss").toDate(),
									// x: date = moment.utc(moment(i.date_received.value)).format(),
									x: i.date_received.value,								
									y: i.quantity.value,
									r: i.quantity.value/100,
									label: i.product_id.display_text,
								}],
								// backgroundColor: "blue"
								backgroundColor: getRandomColor()
							});
						});	
						ecomapp_data.first();
		
					data_obj = {
						datasets: datasets
					};
					// console.log(datasets)	
					draw_chart2(item, ctx, data_obj, 'PO chart - 10 last receivables');
					ecomapp_data.create_table(item.view_form.find('#po_chart-table'), 
						{row_count: 10, dblclick_edit: false});						
					
				}
			);
		// console.log(ecomapp_data);
				
		return ecomapp_data;
	}
	
	
	function draw_chart2(item, ctx, data_obj, title) {
		let myChart = new Chart(ctx, {
			type: 'line',
			data: data_obj,
			//pointDot : true,
				options: {
					plugins: {
					  legend: {
						 display: true,
						 position: 'bottom',
					  },
					title: {
						display: true,
						text: title,
					},				
					},
					scales: {
					  x:{
						type: 'time',
						display: true,
						time: {unit: 'month'},
						// } 
						// max: Date.now()
					},
					  y:{
						//   grace: 1000
						},
	
					},
				}
		});
	
	}
	
	
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('.po_chart_place').width(600);
		item.view_form.find('.po_chart_place').height(800);
		item.view_form.find('#po_chart-canvas').width(600);
		item.view_form.find('.po_chart_place').css('margin-left', '50px');
	}
	this.on_view_form_created = on_view_form_created;
	this.show_purchase_order_details_data = show_purchase_order_details_data;
	this.draw_chart2 = draw_chart2;
	this.getRandomColor = getRandomColor;
	this.on_view_form_shown = on_view_form_shown;
}

task.events.events55 = new Events55();

function Events56() { // northwind_traders.catalogs.api_2 

	function on_view_form_created(item) {
		item.view_options.open_item = false;
		item.view_options.form_header = false;
		item.open({open_empty: true});
		item.paginate = false;
		item.view_form.find("#edit-btn").hide();
		item.view_form.find("#delete-btn").hide();
		item.view_form.find("#new-btn").hide();	
		item.alert('Fetching!');
		item.server('send', function(records, err) {
			item.disable_controls();
			if (err) {
				item.warning('Failed to fetch data: ' + err);
			}
			else {
				if (records.length > 0) {
					records.forEach(function(rec) {
						item.append();
						// item.id.value = rec.id;			
						item.request.value = rec.request;
						item.endpoint.value = rec.endpoint;
						item.value.value = rec.value;
						item.post();
					});
					item.first();
					item.enable_controls();
					item.alert('Successfully fetched from API!');
				}
			}
		});
	
	}
	this.on_view_form_created = on_view_form_created;
}

task.events.events56 = new Events56();

function Events59() { // northwind_traders.catalogs.view_columns 

	let form_by_id;
	
	function find_form_by_id(ID) {
		form_by_id = ID;
	
		let item_by_id = null,
			form_id = form_by_id;
			task.each_item(function(item_task) {
				item_task.each_item(function(item_item) {
					if (item_item.ID == form_id) {
						item_by_id = item_item;
					}
				});		  
			});
			
			return item_by_id;
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('.left-table').css('right', '-14px');
		item.view_form.find('.left-table, .right-table').css('top', '10px');
		item.view_form.find('.central-btns-up, .central-btns-down').css('margin-left', '40px');
		item.view_form.find('#right-btn').css('margin-top', '210px');
		item.view_form.find('#up-btn, #down-btn').css('margin-top', '30px');
		item.view_form.find('.search-btn').hide();
		item.view_form.find('.central-btns-up').css('padding-top', '4px');
		item.view_form.find('#add_columns_btn').hide();
	}
	
	function on_view_form_created(item) {
		item.view_options.width = 800;
	
		let table_left = find_form_by_id(form_by_id),
			table_left_fields = [];
		
		table_left.each_field(function(f) {
			table_left_fields.push({
				field_name: f.field_name,
				field_caption: f.field_caption
			});
		});
		
		let default_view_f = table_left.view_options.fields;
		
		let fields_left = table_left_fields.filter((obj) => !default_view_f.includes(obj.field_name));
		
		item.create_table(item.view_form.find('.left-table'), {height: 400});
		item.open({open_empty: true});
		
		item.on_after_open = function(c) {
			fields_left.forEach(function(rec) {
				c.append();
				c.field_name.value = rec.field_name;
				c.column_name.value = rec.field_caption;
				c.post();
			});
			item.first();
			
		};
		
		let table_right = item.copy();
		
		table_right.create_table($('.right-table'), {height: 400});
		table_right.open({open_empty: true});
		
		table_right.disable_controls();
			try {
				default_view_f.forEach(function(r) {
					table_right.append();
					table_right.field_name.value = r;
	
					let column_name_r = table_left_fields.find((obj) => obj.field_name === r);
	 
					table_right.column_name.value = column_name_r.field_caption; 
					table_right.post();
				});
				table_right.first();
			}
			finally {
				table_right.enable_controls();
			}
		
		item.view_form.find('#right-btn').click(function() {
			if (item.rec_count) {
				table_right.append();
				table_right.column_name.value = item.column_name.value;
				table_right.field_name.value = item.field_name.value;
				table_right.post();
				item.delete();
			}   else {
				item.warning('No available columns!');
			}
		});
		
		item.view_form.find('#left-btn').click(function() {
			if (table_right.rec_count) {
				item.append();
				item.column_name.value = table_right.column_name.value;
				item.field_name.value = table_right.field_name.value;
				item.post();
				table_right.delete();
			}   else {
				item.warning('No available columns!');
			}
		});
		
		item.view_form.find('#up-btn').click(function() {
			if (table_right.rec_no > 0) {
				move_vert(table_right, table_right.rec_no, table_right.rec_no - 1);
			}
		});
		
		item.view_form.find('#down-btn').click(function() {
			if (table_right.rec_no < table_right.rec_count - 1) {
				move_vert(table_right, table_right.rec_no, table_right.rec_no + 1);
			}
		});
		
		item.view_form.find('#cancel-btn').click(function() {
			item.close_view_form();
		});
		
		item.view_form.find('#ok-btn').click(function() {
			let custom_columns_dt = table_right.dataset,
				custom_columns_list = [];
			
				custom_columns_dt.forEach(function(i){
					custom_columns_list.push(i[1]);
				});
				
				return custom_columns_list;
		});
		
		//export dugme
		item.view_form.find('#export_xlsx_btn').click(function() {
			let custom_columns_dt = table_right.dataset,
				custom_columns_list = [];
			
				custom_columns_dt.forEach(function(i){
					custom_columns_list.push(i[1]);
				});
				
				return custom_columns_list;
		});
	}
	
	function move_vert(table_right, rec1, rec2) {
		let r1 = table_right._dataset[rec1],
			r2 = table_right._dataset[rec2],
			i,
			t;
			
			for (i = 0; i < r1.length - 1; i++) {
				t = r1[i];
				r1[i] = r2[i];
				r2[i] = t;
			}
			
			table_right.update_controls();
			table_right.rec_no = rec2;
	}
	
	//export odabranih kolona
	function export_table_xlsx(ID, result, selections) {
		if (selections) {
		task.question('Do you want to export (' + selections.length + ') rows?',
			function() {
				let file_name = task.server('export_table_xlsx', [ID, result, selections]),
					url = [location.protocol, '//', location.host, location.pathname].join('');
					url += file_name;
					window.open(encodeURI(url));
			});
		}   else {
			task.warning('Export is not possible!');
		}
	}
	this.find_form_by_id = find_form_by_id;
	this.on_view_form_shown = on_view_form_shown;
	this.on_view_form_created = on_view_form_created;
	this.move_vert = move_vert;
	this.export_table_xlsx = export_table_xlsx;
}

task.events.events59 = new Events59();

function Events61() { // northwind_traders.authentication.users 

	function on_field_get_text(field) {
		var item = field.owner;
		if (field.field_name === 'password') {
			if (item.id.value || field.value) {
				return '**********';
			}
		}
	}
	
	function on_edit_form_created(item) {
		if (item.is_new()) {
			item.edit_options.title = 'New entry';
		}   else {
			item.edit_options.title = 'Entry preview';   
		}
	}
	
	function on_field_get_text(field) {
		let item = field.owner;
		
		if (field.field_name === 'employee_id') {
			return field.display_text + ' ' + item.employee_last_name.display_text;
		}
	}
	
	function on_field_get_html(field) {
		if (field.field_name === 'user_login' && field.value) {
			return '<h5><span class="badge bg-info">' + field.display_text + '</span></h5>';
		}
		
		if (field.field_name === 'user_active' && field.value) {
			return '<i class="bi bi-check2-square"></i>';
		}
	}
	
	function on_field_changed(field, lookup_item) {
		let item =field.owner;
		
		if (field.field_name === 'employee_id' && lookup_item) {
			item.email_address.value = lookup_item.email_address.value;
		}
	}
	this.on_field_get_text = on_field_get_text;
	this.on_edit_form_created = on_edit_form_created;
	this.on_field_get_text = on_field_get_text;
	this.on_field_get_html = on_field_get_html;
	this.on_field_changed = on_field_changed;
}

task.events.events61 = new Events61();

function Events62() { // northwind_traders.authentication.roles 

	function on_edit_form_shown(item) {
		item.edit_form.find('input.id').width(60);
		item.edit_form.find('input.role_name').focus();
	}
	this.on_edit_form_shown = on_edit_form_shown;
}

task.events.events62 = new Events62();

function Events65() { // northwind_traders.intro.introduction 

	function on_view_form_created(item) {
		show_orders(item);
		show_cat(item);
	}
	
	function show_orders(item) {
	
		let asci = AsciinemaPlayer.create('/static/images/demo03.cast', document.getElementById('asci-container'), {
		poster: 'npt:0:11',
		markers: [
			[3, 'Create project'],
			[5, 'Connect to DB'],
			[7, 'Create Menues'],
			[9, 'Group tables'],
			[11, 'Add CSS'],
		]
		});
	
		return asci;
	}
	function show_cat(item) {
		// Call the server function to get Markdown text
		item.server("get_markdown", function (markdownText, error) {
			if (error) {
				console.error("Error fetching Markdown:", error);
				return;
			}
	
			// Convert Markdown to HTML
			// let htmlContent = marked.parse(markdownText);
			// item.view_form.find(".markdown-container").html(htmlContent);
			// Convert Markdown to HTML
			const htmlContent = marked.parse(markdownText);
	
			// Insert Markdown content
			const container = item.view_form.find(".markdown-container");
			container.html(htmlContent);
	
			// Add AdSense block after the markdown content
			// container.append(`
			//	 <ins class="adsbygoogle"
			//		 style="display:block; text-align:center;"
			//		 data-ad-client="ca-pub-5538093997334301 "
			//		 data-ad-slot="9876543210"
			//		 data-ad-format="auto"
			//		 data-full-width-responsive="true"></ins>
			// `);
	
			// Trigger AdSense render
			// try {
			//	 (adsbygoogle = window.adsbygoogle || []).push({});
			// } catch (e) {
			//	 console.warn("AdSense failed to load:", e);
			// }
		});
	}
	this.on_view_form_created = on_view_form_created;
	this.show_orders = show_orders;
	this.show_cat = show_cat;
}

task.events.events65 = new Events65();

function Events66() { // northwind_traders.intro.introduccion 

	function on_view_form_created(item) {
		const template = task.templates.find(".markdown-container").clone();
		item.view_form.empty().append(template);
		// Call the server function to get Markdown text
		item.server("get_markdown", function (markdownText, error) {
			if (error) {
				console.error("Error fetching Markdown:", error);
				return;
			}
	
			// Convert Markdown to HTML
			let htmlContent = marked.parse(markdownText);
	
			// Insert HTML into the UI
			item.view_form.find(".markdown-container").html(htmlContent);
		});
	}
	this.on_view_form_created = on_view_form_created;
}

task.events.events66 = new Events66();

function Events68() { // northwind_traders.er_diagram.er 

	function on_view_form_created(item) {
		show_cat(item);
	}
	
	
	function show_cat(item) {
		item.server("get_markdown", function (markdownText, error) {
			if (error) {
				console.error("Error fetching Markdown:", error);
				return;
			}
			console.log("Mermaid source:\n" + markdownText);
			item.view_form.find(".mermaid").html(markdownText);
			mermaid.initialize({ startOnLoad: false, 
				  theme: "dark", // or "neutral", "dark", "forest"
				  themeVariables: {
					fontSize: '18px',  // ← Override default font size
					lineHeight: '10.5',
				  }
				
			});
			// mermaid.run({ querySelector: '.mermaid' });
			mermaid.run({
				querySelector: '.mermaid',
				postRenderCallback: (id) => {
					const container = document.getElementById("diagram-container");
					const svgElement = container.querySelector("svg");
			
					// Initialize Panzoom
					const panzoomInstance = Panzoom(svgElement, {
						maxScale: 5,
						minScale: 0.5,
						step: 0.1,
					});
			
					// Add mouse wheel zoom
					container.addEventListener("wheel", (event) => {
						panzoomInstance.zoomWithWheel(event);
					});
				}
			});
	
	
		});
	}
	this.on_view_form_created = on_view_form_created;
	this.show_cat = show_cat;
}

task.events.events68 = new Events68();

})(jQuery, task)