
class getPeriod {
  now: Date;
  nowYear: number;
  nowMonth: number;
  nowDay: number;
  nowDayOfWeek: number;
  constructor() {
    this.now = new Date();
    this.nowYear = this.now.getFullYear(); // 使用getFullYear代替getYear
    this.nowMonth = this.now.getMonth();
    this.nowDay = this.now.getDate();
    this.nowDayOfWeek = this.now.getDay();
  }
  // 格式化数字
  formatNumber(n: any) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  // 格式化日期
  formatDate(date: any) {
    const myyear = date.getFullYear()
    const mymonth = date.getMonth() + 1
    const myweekday = date.getDate()
    return [myyear, mymonth, myweekday].map(this.formatNumber).join('-')
  }
  // 获取某月的天数
  getMonthDays(myMonth: any) {
    const monthStartDate: any = new Date(this.nowYear, myMonth, 1)
    const monthEndDate: any = new Date(this.nowYear, myMonth + 1, 1)
    const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    return days
  }
  // 获取本季度的开始月份
  getQuarterStartMonth() {
    let startMonth = 0
    if (this.nowMonth < 3) {
      startMonth = 0
    }
    if (this.nowMonth > 2 && this.nowMonth < 6) {
      startMonth = 3
    }
    if (this.nowMonth > 5 && this.nowMonth < 9) {
      startMonth = 6
    }
    if (this.nowMonth > 8) {
      startMonth = 9
    }
    return startMonth
  }
  // 获取今天的日期
  getNowDate() {
    return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay))
  }
  // 获取今天的日期凌晨零点时间戳
  getNowDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.nowMonth, this.nowDay);
    dateTime.setHours(0, 0, 0, 0);
    return dateTime.getTime();
  }
  // 获取本周的开始日期
  getWeekStartDate() {
    return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1))
  }
  // 获取本周的开始日期凌晨零点时间戳
  getWeekStartDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1);
    dateTime.setHours(0, 0, 0, 0);
    return dateTime.getTime();
  }
  // 获取本周的结束日期
  getWeekEndDate() {
    return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek + 1)))
  }
  // 获取本周的结束日期时间戳
  getWeekEndDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek + 1));
    dateTime.setHours(23, 59, 59, 0);
    return dateTime.getTime();
  }
  // 获取本月的开始日期
  getMonthStartDate() {
    return this.formatDate(new Date(this.nowYear, this.nowMonth, 1))
  }
  // 获取本月的开始日期凌晨零点时间戳
  getMonthStartDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.nowMonth, 1);
    dateTime.setHours(0, 0, 0, 0);
    return dateTime.getTime();
  }
  // 获取本月的结束日期
  getMonthEndDate() {
    return this.formatDate(new Date(this.nowYear, this.nowMonth, this.getMonthDays(this.nowMonth)))
  }
  // 获取本月的结束日期时间戳
  getMonthEndDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.nowMonth, this.getMonthDays(this.nowMonth));
    dateTime.setHours(23, 59, 59, 0);
    return dateTime.getTime();
  }
  // 获取本季度的开始日期
  getQuarterStartDate() {
    return this.formatDate(new Date(this.nowYear, this.getQuarterStartMonth(), 1))
  }
  // 获取本季度的开始日期凌晨零点时间戳
  getQuarterStartDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.getQuarterStartMonth(), 1);
    dateTime.setHours(0, 0, 0, 0);
    return dateTime.getTime();
  }
  // 获取本季度的结束日期
  getQuarterEndDate() {
    return this.formatDate(new Date(this.nowYear, this.getQuarterStartMonth() + 2, this.getMonthDays(this.getQuarterStartMonth() + 2)))
  }
  // 获取本季度的结束时间戳
  getQuarterEndDateTimestamp() {
    const dateTime = new Date(this.nowYear, this.getQuarterStartMonth() + 2, this.getMonthDays(this.getQuarterStartMonth() + 2));
    dateTime.setHours(23, 59, 59, 0);
    return dateTime.getTime();
  }
  // 获取本年的开始日期
  getYearStartDate() {
    return this.formatDate(new Date(this.nowYear, 0, 1))
  }
  // 获取本年的开始日期凌晨零点时间戳
  getYearStartDateTimestamp() {
    const dateTime = new Date(this.nowYear, 0, 1);
    dateTime.setHours(0, 0, 0, 0);
    return dateTime.getTime();
  }
  // 获取本年的结束日期
  getYearEndDate() {
    return this.formatDate(new Date(this.nowYear, 11, 31))
  }
  // 获取本年的结束日期时间戳
  getYearEndDateTimestamp() {
    const dateTime = new Date(this.nowYear, 11, 31);
    dateTime.setHours(23, 59, 59, 0);
    return dateTime.getTime();
  }
}
export default getPeriod
