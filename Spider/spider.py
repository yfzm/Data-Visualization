# -*- coding:utf-8 -*-
import sys
import urllib2
import re
reload(sys)
sys.setdefaultencoding("utf-8")


class RANK:
    def __init__(self):
        self.pageIndex = 1
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        self.headers = {"Accept-Language": "zh-CN,zh;q=0.8", 'User-Agent': self.user_agent}

        self.data = []
        self.year = 2001
        self.month = 1

        self.end_year = 2017
        self.end_month = 7

    def get_page(self):
        try:
            url = "http://info.sports.sina.com.cn/rank/ittf.php?year=" + str(self.year) + "&month=" + str(self.month)
            request = urllib2.Request(url, headers=self.headers)
            response = urllib2.urlopen(request)
            page_type = sys.getfilesystemencoding()
            pageCode = response.read().decode('gb2312', 'ignore').encode(page_type)
            return pageCode
        except urllib2.URLError, e:
            if hasattr(e, "code"):
                print e.code
            if hasattr(e, "reason"):
                print e.reason

    def get_page_items(self):
        pageCode = self.get_page()
        if not pageCode:
            print "页面加载失败"
            return None
        pattern = re.compile('"tab1">(.*?)</td>.*?"tab2">(.*?)</td>.*?"tab2">(.*?)</td>.*?"tab2">(.*?)</td>.*?"tab2">(.*?)</td>.*?'
                             '"tab1A">(.*?)</td>.*?"tab2A">(.*?)</td>.*?"tab2B">(.*?)</td>.*?"tab2A">(.*?)</td>.*?"tab2B">(.*?)</td>', re.S)
        items = re.findall(pattern, pageCode)
        page_data = []
        for item in items:
            page_data.append([item[0].strip(), item[2].strip(), item[3].strip(), item[4].strip(), item[5].strip(), item[7].strip(), item[8].strip(), item[9].strip()])
        return page_data

    def start(self):
        output = open("data.txt", "w")

        print u"正在爬取数据..."
        while self.year < self.end_year or (self.year == self.end_year and self.month <= self.end_month):
            print self.year, " ", self.month
            page_data = self.get_page_items()
            if page_data:
                for item in page_data:
                    output.write(str(self.year) + "\t" + str(self.month) + "\t" + item[0] + "\t" + item[1] + "\t" + item[2] + "\t" + item[3] + "\n" +
                                 str(self.year) + "\t" + str(self.month) + "\t" + item[4] + "\t" + item[5] + "\t" + item[6] + "\t" + item[7] + "\n")
            else:
                output.write(str(self.year) + "\t" + str(self.month) + "\t" + "none" + "\n")

            self.next_time()

        output.close()
        print u"数据全部爬取成功，已保存在data.txt中！"

    def next_time(self):
        if self.month != 12:
            self.month += 1
        else:
            self.month = 1
            self.year += 1


def main():
    spider = RANK()
    spider.start()

if __name__ == "__main__":
    main()
