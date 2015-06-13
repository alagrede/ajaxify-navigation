package demo.config;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration.FreeMarkerWebConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import kr.pe.kwonnam.freemarker.inheritance.*;

/**
 * Configuration spécifique de Freemarker pour inclure un mécanisme d'héritage de blocs 
 * 
 * @author anthony.lagrede
 *
 */
@Configuration
public class FreeMarkerConfiguration extends FreeMarkerWebConfiguration {

	private final Logger log = LoggerFactory.getLogger(FreeMarkerConfiguration.class);

	@Override public FreeMarkerConfigurer freeMarkerConfigurer() {

		log.debug("Configuring FreeMarker variables");

		FreeMarkerConfigurer freeMarkerConfigurer = super
				.freeMarkerConfigurer();

		Map<String, Object> freemarkerVariables = new HashMap<String, Object>();

		Map<String, Object> freemarkerVariablesMap = new HashMap<String, Object>();

		freemarkerVariablesMap.put("extends", new ExtendsDirective());
		freemarkerVariablesMap.put("block", new BlockDirective());
		freemarkerVariablesMap.put("put", new PutDirective());

		freemarkerVariables.put("layout", freemarkerVariablesMap);

		freeMarkerConfigurer.setFreemarkerVariables(freemarkerVariables);

		return freeMarkerConfigurer;
	}

	@Override public FreeMarkerViewResolver freeMarkerViewResolver() {
		log.debug("Configuring FreeMarker view resolver");

		FreeMarkerViewResolver freeMarkerViewResolver = super.freeMarkerViewResolver();

		freeMarkerViewResolver.setRequestContextAttribute("requestContext");
//		freeMarkerViewResolver.setExposeSessionAttributes(true);
//		freeMarkerViewResolver.setExposeRequestAttributes(true);

		return freeMarkerViewResolver;
	}
}