sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel"
], function(Controller, oModel, JSONModel) {
	"use strict";

	return Controller.extend("scrollboard.controller.dynamicsalesdbtile", {
		onInit: function() {
			this.getView().setModel(new JSONModel(), "tileModel");
			setInterval(this.dataFetch(),500000);
		},
		dataFetch : function(){
			var oViewData = this.getView().getViewData();
			var DateIndicator = "MTD";
			var Brand = "Classe";
			var Group = "Total";
			var Currency = "USD";
			var Subtitle = "Month Comparison ($)";
			if (oViewData !== undefined) {
				DateIndicator = oViewData.properties.DateIndicator;
				Brand = oViewData.properties.Brand;
				Group = oViewData.properties.Group;
				Currency = oViewData.properties.Currency;
				if( oViewData.properties.sub === "M"){
					Subtitle = "month comparison ($)";
				}else{
					Subtitle = "fiscal year comparison ($)";

				}
			}
			
			$.ajax('/sap/fiori/scrollboard/Azure_OData/SalesDashboardOdata.svc/grpSalesDashboards?$format=json',
				{
					success: $.proxy(function( oData, sTextStatus, oJqXHR ){
						var dataArray = oData.value;
					var dataset = {};
					dataset.Brand = Brand;
					dataset.Subtitle = Subtitle;
					dataset.Currency = Currency;
					dataArray.map($.proxy(function(e) {
						if (e.DateIndicator === DateIndicator && e.Brand === Brand && e.Region === Group) {
							dataset.value1 = e.SalesValue;
							dataset.title1 = e.DateText;
							dataset.displayValue1 = e.SalesValue + e.Scale;
						} else if (e.DateIndicator === DateIndicator + "-1" && e.Brand === Brand && e.Region === Group) {
							dataset.value2 = e.SalesValue;
							dataset.title2 = e.DateText;
							dataset.displayValue2 = e.SalesValue + e.Scale;
						} else if (e.DateIndicator === DateIndicator + "DIFF" && e.Brand === Brand && e.Region === Group) {
							dataset.deltaDisplayValue = e.SalesValue + "%";
							dataset.color = e.Color;
						}
					}, this));
					this.getView().getModel("tileModel").setData(dataset);
				},this)
			});
		}
	});
});