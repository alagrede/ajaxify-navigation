package demo.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import demo.common.filter.RedirectionInterceptor;

@Controller
@RequestMapping("/")
public class DemoController {
	
	List<String> contacts = new ArrayList<String>();
	
	{
		contacts.add("user1");
		contacts.add("user2");
	}
	
	@Value("${application.message:Hello World}")
	private String message = "Hello World";
	
	@RequestMapping("/index")
	public String welcome(Map<String, Object> model) {
		return "page/demo";
	}	
	
	@RequestMapping(value = "/popup", method = RequestMethod.GET)
	public String popup(Map<String, Object> model) {
		model.put("contacts", contacts);
		return "page/popup";
	}	

	@RequestMapping(value = "/add", method = RequestMethod.GET)
	public String add(Map<String, Object> model) {
		model.put("contacts", contacts);
		return "page/add";
	}	

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public String addSave(Map<String, Object> model, @RequestParam("name") String name, @RequestParam("date") String date) {
		contacts.add(name + "." + date);
		model.put("contacts", contacts);
		model.put("notif", "true");
		return "page/add";
	}	

	
	@RequestMapping("/list")
	public String list(Map<String, Object> model) {
		model.put("contacts", contacts);
		return "page/list";
	}	

	/**
	 * La bonne url de redirection est gérée grâce au filtre {@link RedirectionInterceptor}  
	 */
	@RequestMapping("/redirect")
	public String redirect(Map<String, Object> model) {
		return "redirect:/index";
	}	

	
}
