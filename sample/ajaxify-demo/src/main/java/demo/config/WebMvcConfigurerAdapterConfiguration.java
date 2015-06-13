package demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import demo.common.filter.RedirectionInterceptor;

@Configuration
public class WebMvcConfigurerAdapterConfiguration extends WebMvcConfigurerAdapter {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		final RedirectionInterceptor redirectionInterceptor = new RedirectionInterceptor();

		registry.addInterceptor(redirectionInterceptor);
	}

	
}
