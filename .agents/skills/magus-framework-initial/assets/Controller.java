package com.magus.lowcode.xxx.xxxs.controller;

import com.magus.cloud.framework.common.domain.base.BaseTreeNode;
import com.magus.cloud.framework.common.domain.rsp.CommonRsp;
import com.magus.cloud.framework.common.domain.rsp.DataRsp;
import com.magus.cloud.framework.common.domain.rsp.ListRsp;
import com.magus.cloud.framework.common.domain.rsp.PageRsp;
import com.magus.cloud.framework.initial.annotation.AppFunctionInfo;
import com.magus.cloud.framework.initial.annotation.AppGroupInfo;
import com.magus.cloud.framework.initial.annotation.AppInfo;
import com.magus.lowcode.xxx.xxxs.dto.req.XxxInfoReq;
import com.magus.lowcode.xxx.xxxs.dto.req.XxxInfoSearchReq;
import com.magus.lowcode.xxx.xxxs.dto.rsp.XxxInfoRsp;
import com.magus.lowcode.xxx.xxxs.service.XxxInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *@Description xxx基本信息表controller
 *@Author magus
 **/
@Tag(name = "xxx基本信息表接口")
@RestController
@RequestMapping("/xxx-info")
@AppInfo(key = "xxx", name = "xxx管理平台", enName = "Xxx Manager", remark = "xxx管理平台")
@AppGroupInfo(key = "xxx:xxx_info", parentKey = "xxx", page = "/xxx-info/page", name = "xxx管理", enName = "Xxx Info", appKey = "xxx")
public class XxxInfoController {

    @Autowired
    private XxxInfoService xxxInfoService;

    @PostMapping("/page")
    @Operation(summary = "列表分页")
    @AppFunctionInfo(url = "/xxx-info/page", name = "列表分页", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:find", "xxx:xxx_info:upsert", "xxx:xxx_info:delete"})
    public PageRsp<XxxInfoRsp> page(@RequestBody XxxInfoSearchReq searchReq) {
        Page<XxxInfoRsp> result = xxxInfoService.page(searchReq);
        return new PageRsp<>(searchReq, result.getTotalElements(), result.getContent());
    }

    @PostMapping("/list")
    @Operation(summary = "列表查询")
    @AppFunctionInfo(url = "/xxx-info/list", name = "列表查询", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:find", "xxx:xxx_info:upsert", "xxx:xxx_info:delete"})
    public ListRsp<XxxInfoRsp> list(@RequestBody XxxInfoSearchReq searchReq) {
        List<XxxInfoRsp> result = xxxInfoService.list(searchReq);
        return new ListRsp<>(result);
    }

    @GetMapping("/tree")
    @Operation(summary = "树结构查询")
    @AppFunctionInfo(url = "/xxx-info/tree", name = "树结构查询", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:find", "xxx:xxx_info:upsert", "xxx:xxx_info:delete"})
    public ListRsp<BaseTreeNode> tree() {
        List<BaseTreeNode> result = xxxInfoService.tree();
        return new ListRsp<>(result);
    }

    @GetMapping("/find-by-id/{id}")
    @Operation(summary = "根据ID查询")
    @AppFunctionInfo(url = "/xxx-info/find-by-id/{id}", name = "根据ID查询", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:find", "xxx:xxx_info:upsert"})
    public DataRsp<XxxInfoRsp> findOne(@PathVariable String id) {
        XxxInfoRsp result = xxxInfoService.findOne(id);
        return new DataRsp<>(result);
    }

    @PostMapping("/upsert")
    @Operation(summary = "新增或编辑")
    @AppFunctionInfo(url = "/xxx-info/upsert", name = "新增或编辑", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:upsert"})
    public CommonRsp upsert(@RequestBody XxxInfoReq xxxInfoReq) {
        xxxInfoService.upsert(xxxInfoReq);
        return new CommonRsp();
    }

    @PostMapping("/delete")
    @Operation(summary = "删除")
    @AppFunctionInfo(url = "/xxx-info/delete", name = "删除", groupKey = "xxx:xxx_info", functions = {"xxx:xxx_info:delete"})
    public CommonRsp delete(@RequestBody List<String> ids) {
        xxxInfoService.deleteAll(ids);
        return new CommonRsp();
    }

}
