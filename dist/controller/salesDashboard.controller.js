sap.ui.controller("scrollboard.controller.salesDashboard", {
	
	_oTileModel : null,
	_oView : null,
	_sModelName : "CompChartModel",
	
	onInit: function(){
		this._oView = this.getView;
		this._oTileModel = new sap.ui.model.odata.ODataModel("/sap/fiori/scrollboard/Azure_OData/SalesDashboardOdata.svc/");
		this._oView().setModel(this._oTileModel, this._sModelName);

		window.setInterval(jQuery.proxy(function() {
			this._oTileModel.refresh();		
		}, this), 500000);
	}
	
});