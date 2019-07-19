import scrapy

class SmartphoneSpider(scrapy.Spider):

	# Name of crawler
	name = 'smartphone'

	# Urls to start
	start_urls = [
		'https://www.submarino.com.br/categoria/celulares-e-smartphones/smartphone?ordenacao=relevance'
	]

	# Delay to get data
	download_delay = 3.0

	# Random User Agent
	custom_settings = {
        'DOWNLOADER_MIDDLEWARES' : {
		    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
		    'scrapy_user_agents.middlewares.RandomUserAgentMiddleware': 400,
            }
    }


	# Function to parse page
	def parse(self,response):	

		# Get selector
		selector = response.xpath("//div[@id='content-middle']/div[4]/div/div/div/div[1]/div")

		# For each selector get data
		for sel in selector:
			# Save data
			yield {
				'title' : sel.xpath('div/div[2]/a/section/div[2]/div[1]/h3/text()').get(),
			}


		# Get next link to next page
		next_page = response.xpath('//*[@id="content-middle"]/div[4]/div/div/div/div[2]/div/ul/li[10]/a/@href').get()

		# Verify if link exist
		if(next_page != "#"):
			# Join relative url
			next_page_link = response.urljoin(next_page)

			# Go to next page
			yield scrapy.Request(url=next_page_link,callback=self.parse)