package ch.sectioninformatique.template.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sectioninformatique.template.log.LogExceptions.LogNotFoundException;

import java.util.ArrayList;
import java.util.List;

import ch.sectioninformatique.template.item.ItemExceptions.ItemNotFoundException;
import ch.sectioninformatique.template.item.ItemExceptions.UnauthorizedItemException;


@RequestMapping("/logs")
@RestController
public class LogController {

    @Autowired
    private LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }


    @PreAuthorize("hasAuthority('log:read')")
    @GetMapping
    public List<LogDTO> getLogs(@RequestParam(defaultValue = "false") boolean includeDeleted)
    {
            List<LogDTO> logs = new ArrayList<>();
            logService.getLogs(includeDeleted).forEach(log -> logs.add(new LogDTO(log)));
            return logs;
    }

    @PreAuthorize("hasAuthority('log:read')")
    @GetMapping("/{id}")
    public Log getLog(@PathVariable Long id) {
        return logService.getLog(id)
            .orElseThrow(() -> new LogNotFoundException(id));
    }

    @PreAuthorize("hasAuthority('log:write')")
    @PostMapping("/")
    public Log createLog(@RequestBody Log log) {
        return logService.createLog(log);
    }

    @PreAuthorize("hasAuthority('log:write')")
    @PostMapping("/{login}")
    public Log existsByLogin(@PathVariable String login) {
        return logService.existsByLogin(login);
    }

    @PreAuthorize("hasAuthority('log:update')")
    @PutMapping("/{id}")
    public Log updateLog(@PathVariable Long id, @RequestBody Log log) {
        return logService.updateLog(id, log);
    }

    @PreAuthorize("hasAuthority('log:delete') || ((hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')) && hasAuthority('log:write'))")
    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean softDelete) {
        if (softDelete) {
            logService.deleteLog(id);
        } else {
            logService.deletePermanentById(id);
        }
    }

}



