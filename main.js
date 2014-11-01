function printInventory(inputs){
	var items = loadAllItems();
	var promotions = loadPromotions()[0].barcodes;

	var cart = function Cart(){
		var itemList = [];
		var total = 0;
		var save = 0;

		function add(item, amount){
			var index = -1;
			for(var i = 0; i<itemList.length; i++){
				if(itemList[i].barcode === item.barcode){
					itemList[i].amount += amount;
					index = i;
					break;
				}	
			}
			if(index < 0){
				index = itemList.length;
				itemList.push(cartItem(item, amount));
			}
			if(hasPromotion(itemList[index])){
				itemList[index].promotionAmount = itemList[index].amount > 1 ? 1 : 0;
				itemList[index].save = itemList[index].price * itemList[index].promotionAmount;
			}
			itemList[index].charge = (itemList[index].amount - itemList[index].promotionAmount) * itemList[index].price;
		};

		function cartItem(item, amount){
			return {barcode: item.barcode, name:item.name, price:item.price, unit:item.unit, amount:amount, promotionAmount: 0, save: 0.00, charge: item.price * amount};
		};

		function getTotal(){
			var total = 0;
			for(var i = 0; i<itemList.length; i++){
				total += itemList[i].charge;
			}
			return total;
		};

		function getSave(){
			var save = 0;
			for(var i = 0; i<itemList.length; i++){
				save += itemList[i].save;
			}
			return save;
		};

		function hasPromotion(item){
			var r = false;
			for(var i =0; i< promotions.length; i++){
				if(promotions[i] === item.barcode){
					r = true;
				}
			}
			return r;
		};

		return {
			add : add,
			itemList : itemList,
			total : getTotal,
			save : getSave
		}
	}();

	inputs.forEach(function(i){
		cart.add(findItem(parseCode(i)), parseAmount(i));
	});

	print(cart.itemList, cart.total(), cart.save());

	function print(items, total, save){
		var text = "***<没钱赚商店>购物清单***\n";
		for(var i =0; i<items.length; i++){
			text += "名称：" + items[i].name +"，数量：" + items[i].amount + items[i].unit + "，单价：" + items[i].price.toFixed(2) + "(元)，小计：" + items[i].charge.toFixed(2) + "(元)\n";	
		}
		text += '----------------------\n';
		text += '挥泪赠送商品：\n' ;
		for(var i =0; i<items.length; i++){
			if(items[i].promotionAmount > 0){
				text += "名称：" + items[i].name + "，数量：" + items[i].promotionAmount + items[i].unit + "\n";		
			}
		}
		text += '----------------------\n';
		text += "总计：" + total.toFixed(2) + "(元)\n";
		text += "节省：" + save.toFixed(2) + "(元)\n";
		text += '**********************';

        console.log(text);
	}

	function parseCode(str){
		return str.split("-")[0];
	}

	function parseAmount(str){
		return str.indexOf("-") >= 0 ? str.split("-")[1] - "0" : 1; 
	}

	function findItem(code){
		var item;
		items.forEach(function(i){
			if(i.barcode === code){
				item = i;
			}
		});
		return item;
	}
}

