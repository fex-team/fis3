/**
 * get thailand buddhist calendar
 * @param  {Date}  date
 * @return {Object}  {
 *	 y  year
 *   M  month
 *   d  day
 *   h  hour
 *   m  minute
 *   s  second
 *   w  week
 *   z  timezone offset
 * }    
 */
Date.extend && Date.extend({
	toFl: function(date) {
		var d = new Date(date).format();
		d.y += 543;
		return d;
	}
});