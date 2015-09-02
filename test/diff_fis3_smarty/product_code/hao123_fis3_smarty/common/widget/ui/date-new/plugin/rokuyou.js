/**
 * get japanese rokuyou calendar
 * @depend toLunar() function
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
 *   jl  japan rokuyou frequency[0, 5]
 * }    
 */
Date.extend && Gl.date && Gl.date.toLunar && Date.extend({
	toLyl: function(date) {
		var lunar, lm, ld;

		date = new Date(date);
		lunar = Gl.date.toLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());

		d = date.format();

		lm = parseInt(lunar.cm, 10);
		ld = parseInt(lunar.cd, 10);

		lm = lm > 6 ? lm - 7 : lm - 1;
		d.jl = (lm + ld - 1) % 6;

		return d;
	}
});