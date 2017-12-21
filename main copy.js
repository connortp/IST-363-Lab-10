const key = 'egd9agaeueg5pq4pw8xwam8a';

$(function(){
    function Item(data) {
        this.id = data.itemId;
        this.name = data.name;
        this.image = data.mediumImage;
        this.msrp = data.msrp;
        this.price = data.salePrice;
        this.addedToCart = ko.observable(false)
    }

function Cart() {
    var self = this;
    self.items = ko.observableArray([]);

    self.numItems = ko.computed(function(){
        return self.items().length;
    });

    self.total = ko.computed(function(){
        var total = 0.00;
        $.each(self.items(), function(index, product){
            total += product.price;
        });
        return total.toFixed(2);
    });

}

    var vm = function() {
        var self = this;

        self.data = ko.observableArray();

        self.cart = new Cart();

        self.addToCart = function(item) {
            self.cart.items.push(item);
            item.addedToCart(true);
        };

        $.ajax({
            url: 'https://api.walmartlabs.com/v1/search',
            method: 'GET',
            dataType: 'jsonp',
            data: {
                'apiKey': key,
                'query': 'laptop',
                'categoryID': 3944,
                'sort': 'bestseller',
                'responseGroup': 'full',
                'numItems': 25
            }
            
        }).done(function(response){
            $.each(response.items,function(index, data){
                var product = new Item(data);

                if(this.msrp) {
                    product.sale = parseFloat((this.msrp - this.salePrice) / this.msrp * 100).toFixed(0);
                } else {
                    product.sale = 0;
                }

                self.data.push(product);
            });

            console.log(self.data());
        });
    }

    ko.applyBindings(new vm());
});
